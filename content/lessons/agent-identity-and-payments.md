---
title: "Agent Identity, Authorization & Payments"
description: "How agents prove who they are and what they may do: delegated OAuth, MCP authorization, credential brokers, signed agent requests, audit trails, and the emerging protocols for agent payments."
duration: 45
level: advanced
objectives:
  - Explain why agents need their own identity, distinct from both the user and anonymous bots
  - Distinguish authentication from authorization, and delegation from impersonation
  - Design delegated OAuth for an agent with PKCE, narrow scopes, audience-bound short-lived tokens and token exchange, and explain how MCP applies OAuth 2.1
  - Build a credential broker that keeps secrets out of the model's context and enforces scopes, merchant allowlists and spend caps
  - Compare the agent payment protocols (AP2, ACP, UCP, x402, card-network programs) and the controls that bound payment fraud and prompt injection
prerequisites: [agent-security, guardrails-and-sandboxing, protocols-mcp-a2a]
tags: [identity, oauth, authorization, mcp, payments, ap2, acp, x402, web-bot-auth, audit]
---

Your assistant spent the morning on your behalf: it moved two meetings, renewed a subscription and bought a laptop charger. Now three people want answers. Your finance team asks who approved the $79 renewal. The merchant asks whether the charger order really came from you or from a bot using a stolen card. Your security team asks whether that assistant, which also reads email from strangers, holds the token that can empty your company's cloud account.

These are questions about **identity** (who is acting?), **authorization** (what may they do?) and **accountability** (can we prove what happened?). The web answers them for humans with logins, sessions and the assumption that a person clicked "Buy". Agents break that assumption.

This lesson builds on [Agent Security](agent-security.html) and [Guardrails, Permissions & Sandboxing](guardrails-and-sandboxing.html) and goes deep on the identity layer: delegated OAuth and how MCP uses it, keeping secrets out of the model, signed agent requests on the web, audit trails that survive a dispute, and the new protocols that let agents pay.

## Why Agent Identity Matters

When software acts for a person, at least four parties are involved: the **human principal** whose authority is used, the **agent** (specific software, version and session), the **operator** that runs it, and the **relying party** (the API, site or merchant deciding whether to honor the request). The model is a component of the agent and holds no rights of its own.

Early integrations collapsed these into one: the agent logged in *as* the user, or carried an API key with the user's full rights. That works until something goes wrong.

| Property | Question it answers | What breaks without agent identity |
|---|---|---|
| **Accountability** | Who did this, and on whose behalf? | Logs show "alice" did it, whether Alice clicked or her agent acted on an injected instruction |
| **Least privilege** | What is the minimum this actor needs? | The agent inherits everything the user can do |
| **Revocation** | Can we stop this actor without stopping others? | Disabling a misbehaving agent means resetting the user's password |
| **Audit** | Can we reconstruct and prove what happened? | No record separates human actions from delegated ones |
| **Classification** | Is this traffic a human, a known agent or an anonymous bot? | Sites must guess from IP addresses and user-agent strings, and either block helpful agents or admit scrapers |

> [!KEY] On behalf of, never as
> An agent should act **on behalf of** a user, with its own identity and a narrower grant, never **as** the user. Everything in this lesson follows from keeping the two identities separate but linked.

## Authentication vs. Authorization

- **Authentication** (often shortened to *authn*) establishes *who* a party is: a user signing in with a passkey, a service presenting a client certificate, an agent signing a request with its private key.
- **Authorization** (*authz*) decides *what that party may do*: read this calendar, charge up to $50 at this merchant, push to this repository.

An agent needs both, for two subjects: the *user* authenticates to grant authority, and the *agent* authenticates to exercise it.

The distinction that matters most is **delegation versus impersonation**. With **impersonation**, the agent holds credentials indistinguishable from the user's, so nobody downstream can tell who acted. With **delegation**, the credential records both the subject (Alice) *and* the actor (the agent), with a grant narrower than Alice's own rights. That is what makes per-agent revocation, audit and least privilege possible.

The agent's own identity uses the same building blocks as any service: **workload identity** (a cryptographic identity issued to a running process, such as a cloud service account or a SPIFFE ID), OAuth client credentials, or a published key pair. What is new is binding it to *one user's delegation*, often for *one task*.

## Delegated Authorization with OAuth

**OAuth 2.0** is the web's standard for delegated authorization: a user grants an application limited access to their resources elsewhere without sharing a password. Its roles map onto agents:

- **Resource owner**: the user.
- **Client**: the agent host (the application running the agent loop).
- **Authorization server (AS)**: issues tokens after the user consents.
- **Resource server (RS)**: the API that accepts tokens.

**OAuth 2.1**, still an IETF draft in 2026, consolidates a decade of lessons: PKCE for every authorization-code client, no implicit flow, exact redirect URI matching, and refresh tokens that are sender-constrained or rotated on each use. On 2.0, follow the **Security Best Current Practice** (RFC 9700, January 2025).

### Authorization code with PKCE

An agent host obtains consent with the **authorization code grant** plus **PKCE** (Proof Key for Code Exchange, RFC 7636). The host generates a random *code verifier* and sends only its SHA-256 hash, the *code challenge*, with the authorization request. To redeem the code it must present the verifier, so an attacker who intercepts the code (via a malicious app on the same redirect URI, a leaky log or a browser extension) can't use it.

```mermaid
sequenceDiagram
  participant U as User
  participant H as Agent host
  participant AS as Authorization server
  participant B as Credential broker
  participant API as Calendar API
  U->>H: "Move my 3pm meeting to Friday"
  H->>H: Create PKCE verifier and S256 challenge
  H->>U: Open consent page (scope, resource, challenge)
  U->>AS: Sign in and approve calendar.events
  AS-->>H: Redirect with authorization code
  H->>AS: Code + PKCE verifier
  AS-->>H: Access token (aud=Calendar API, 10 min) + refresh token
  H->>B: Store tokens in vault (model never sees them)
  Note over H: Model emits tool call move_event(...)
  H->>B: Execute move_event
  B->>API: PATCH event with Bearer token
  API-->>B: 200 OK (aud, scope and expiry checked)
  B-->>H: Result with secrets redacted
```

Notice where the token lives: in the broker's vault, never in the model's context.

### Scopes, audiences and lifetimes

Three properties determine how much damage a misused or stolen token can do:

- **Scope**: *which operations*. Request `calendar.events`, not full account access; read on one repository, not write on the organization. Ask for more only when needed (**incremental authorization**).
- **Audience**: *which API*. An **audience-bound** token carries an `aud` claim naming the one resource server that should accept it, requested with the `resource` parameter (**Resource Indicators**, RFC 8707). A leaked calendar token is useless at the payments API.
- **Lifetime**: access tokens should live minutes. **Refresh tokens** mint new ones without bothering the user; they are the crown jewels, so vault them, rotate them on use, and keep them away from any model.

Stronger still, a **sender-constrained** token is bound to a key the client holds, so a stolen copy is useless: **DPoP** (RFC 9449) does this at the application layer, mutual TLS at the transport layer.

### Refresh and revocation

If the agent has its own OAuth client and grants, the user or an administrator can revoke *that agent's* refresh token without touching their own sessions or other agents. Show users their connected agents with scopes and last use, make revocation one click, and make the broker fail closed when a refresh fails rather than falling back to a broader credential.

### Token exchange and on-behalf-of

Agents often sit mid-chain: user → agent host → tool service → downstream API. Forwarding the user's token down the chain is dangerous (MCP forbids this "token passthrough"); each hop should obtain a *new* token for the next audience.

**OAuth 2.0 Token Exchange** (RFC 8693) standardizes this. A service presents a `subject_token` (the user) and optionally an `actor_token` (itself), and asks for a token with a specific `audience` and narrower `scope`. The result can carry an **`act` (actor) claim** recording who acts for whom:

```json
{
  "iss": "https://auth.example.com",
  "sub": "user-42",
  "aud": "https://calendar.example.com",
  "scope": "calendar.events",
  "exp": 1795430400,
  "act": { "sub": "agent:travel-assistant@v3" }
}
```

That `act` claim is delegation, written into the token. Microsoft's identity platform calls a similar grant the **on-behalf-of (OBO)** flow, a name now widely used for the pattern.

### Consent screens that mean something

Consent is the moment a human actually grants authority. Name the **agent**, not just the app ("Travel Assistant v3, run by Acme"); describe scopes by their **consequences** ("create, change and delete events"); show duration and how to revoke; and prefer small, task-specific grants over one large grant "just in case".

Two standards fit agents well. **Rich Authorization Requests** (RFC 9396) replace scope strings with structured `authorization_details`, such as "one payment of at most €45 to this payee". **CIBA** (OpenID's Client-Initiated Backchannel Authentication) lets a client have the authorization server push an approval request to the user's phone, ideal for a background agent that needs one human "yes".

## How MCP Applies OAuth 2.1

[Protocols: MCP & A2A](protocols-mcp-a2a.html#authorization) introduced the model: a remote MCP server is an OAuth resource server discovered via Protected Resource Metadata (RFC 9728), clients use authorization code plus PKCE, tokens are audience-bound, and passthrough is forbidden. The current specification (revision 2026-07-28) adds details that matter when you build or evaluate a client or server:

- **PKCE is verified.** Clients must use `S256` when technically capable, and must refuse to proceed if the authorization server's metadata lacks `code_challenge_methods_supported`.
- **Resource indicators are mandatory.** Clients send the server's canonical URI as `resource`. Servers must reject tokens not issued for them and must not accept or transit any other token.
- **Scopes are minimized, then stepped up.** On a `401`, the server should name the needed scopes in `WWW-Authenticate`, and the client requests exactly those. If a later operation needs more, the server answers `403` with `error="insufficient_scope"` and the required scopes, and the client runs **step-up authorization**: it re-authorizes for the *union* of old and new scopes, so it keeps what it had.
- **Issuer validation.** Clients compare the `iss` in the authorization response with the issuer they recorded before redirecting (RFC 9207), defeating "mix-up" attacks that trick a client into sending a code to the wrong server.
- **Refresh tokens are never assumed.** Clients may ask for `offline_access`; the authorization server decides.

Two official, opt-in **authorization extensions** cover cases user consent doesn't fit. **OAuth Client Credentials** gives machine-to-machine access for background services and CI, with the agent authenticating as *itself*. **Enterprise-Managed Authorization** puts the organization's identity provider (IdP) in charge: the client exchanges the employee's SSO assertion at the IdP for an **Identity Assertion JWT Authorization Grant** (ID-JAG) via an RFC 8693 token exchange, then trades it for an access token at the MCP server's authorization server. No per-server consent screens, and revocation at the IdP applies everywhere.

> [!NOTE]
> MCP is versioned by date and its authorization rules have tightened with each revision. Check the current specification before implementing, and prefer an official SDK, which handles discovery, PKCE and step-up for you.

## Keep Secrets Out of the Model

The most important rule in this lesson: **never give a model a raw, long-lived secret**, whether in the system prompt, a tool result, an environment variable a code tool can print, or memory. Anything in context can come back out (in a reply, a tool argument, an image URL), and prompt injection turns that into an attack ([the lethal trifecta](agent-security.html#the-lethal-trifecta-and-exfiltration)). Context is also copied widely: traces, eval datasets, logs, caches.

Instead, use a **credential broker**: a component outside the model that holds tokens, decides whether a tool call may use one, attaches it, and strips secrets from results. [Guardrails & Sandboxing](guardrails-and-sandboxing.html#credential-isolation-via-proxies) showed the network-level version, an egress proxy. A broker works at the application level, so it also knows *which tool* is being called and *for how much money*.

### Per-tool and per-action scoping

- **Per tool**: each tool declares one scope and one audience. `list_orders` gets an `orders:read` token for the orders API and can never obtain a payments token.
- **Per action**: arguments are checked against the grant: allowlisted merchant, under the approval threshold, within the remaining budget.
- **Per call**: a fresh short-lived token for each call (via token exchange), so one that leaks through an API response expires in minutes.

### A credential-broker tool executor

A `Grant` records what the user approved; each `ToolSpec` declares the scope and audience its API needs. The broker checks the grant, reserves spend before charging, adds an idempotency key so a retry can't charge twice, mints a short-lived token per call, and redacts it from results.

```python
import hashlib, json, time
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Callable

@dataclass
class Grant:                          # what the user approved on the consent screen
    grant_id: str
    user_id: str
    agent_id: str
    scopes: frozenset[str]
    merchants: frozenset[str]         # payee allowlist
    session_cap: Decimal              # total spend allowed under this grant
    approve_above: Decimal            # purchases above this need a fresh human approval
    expires_at: float
    spent: Decimal = Decimal("0")

@dataclass(frozen=True)
class ToolSpec:
    call: Callable[..., dict]         # the real API call; the broker passes token= to it
    scope: str                        # the one scope this tool needs
    audience: str                     # the API the token must be bound to
    spends: bool = False

class CredentialBroker:
    def __init__(self, grant: Grant, tools: dict[str, ToolSpec],
                 mint_token: Callable[..., str], approve: Callable[[Grant, dict], bool],
                 audit: Callable[[dict], None]):
        self.grant, self.tools = grant, tools
        self.mint_token, self.approve, self.audit = mint_token, approve, audit

    def check(self, name: str, args: dict[str, Any]) -> str | None:
        g, spec = self.grant, self.tools.get(name)
        if spec is None:
            return f"unknown tool {name}"
        if time.time() > g.expires_at:
            return "grant expired; the user must re-authorize"
        if spec.scope not in g.scopes:
            return f"scope {spec.scope} was not granted"
        if spec.spends:
            amount = Decimal(str(args.get("amount", "0")))
            if args.get("merchant") not in g.merchants:
                return "merchant is not on the allowlist"
            if amount <= 0 or g.spent + amount > g.session_cap:
                return f"amount {amount} breaks the cap ({g.spent} of {g.session_cap} used)"
            if amount > g.approve_above and not self.approve(g, args):
                return "the user declined this purchase"
        return None

    def run(self, name: str, args: dict[str, Any]) -> dict[str, Any]:
        reason, g = self.check(name, args), self.grant
        self.audit({"ts": time.time(), "grant": g.grant_id, "user": g.user_id,
                    "agent": g.agent_id, "tool": name, "args": args,
                    "decision": reason or "allow"})
        if reason:
            return {"content": f"Blocked by policy: {reason}", "is_error": True}
        spec = self.tools[name]
        extra: dict[str, Any] = {}
        if spec.spends:
            g.spent += Decimal(str(args["amount"]))   # reserve first; never release on unknown outcome
            key = json.dumps([g.grant_id, name, args], sort_keys=True)
            extra["idempotency_key"] = hashlib.sha256(key.encode()).hexdigest()[:32]
        # Short-lived, down-scoped, audience-bound token minted per call (e.g. RFC 8693 exchange).
        token = self.mint_token(subject=g.user_id, actor=g.agent_id,
                                audience=spec.audience, scope=spec.scope, ttl_s=300)
        try:
            result = json.dumps(spec.call(**args, token=token, **extra))
        except Exception as e:                        # message omitted: it might echo the token
            return {"content": f"{type(e).__name__}: outcome unknown, do not retry blindly",
                    "is_error": True}
        return {"content": result.replace(token, "[REDACTED]"), "is_error": False}
```

Wiring it into a manual agent loop takes a few lines. The schemas the model sees contain only business arguments, never a token or card number:

```python
import anthropic

client = anthropic.Anthropic()
TOOLS = [
    {"name": "list_orders", "description": "List the user's recent orders.",
     "input_schema": {"type": "object", "properties": {}}},
    {"name": "buy", "description": "Buy one item from an approved merchant. Amount in USD, e.g. '19.99'.",
     "strict": True,
     "input_schema": {"type": "object", "additionalProperties": False,
                      "required": ["merchant", "item", "amount"],
                      "properties": {"merchant": {"type": "string"}, "item": {"type": "string"},
                                     "amount": {"type": "string"}}}},
]

def run_agent(broker: CredentialBroker, task: str, max_steps: int = 20) -> str:
    messages = [{"role": "user", "content": task}]
    for _ in range(max_steps):
        response = client.messages.create(model="claude-opus-5-5", max_tokens=16000,
                                          tools=TOOLS, messages=messages)
        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason == "pause_turn":
            continue
        if response.stop_reason != "tool_use":       # end_turn, max_tokens or refusal
            return "".join(b.text for b in response.content if b.type == "text")
        results = [{"type": "tool_result", "tool_use_id": b.id, **broker.run(b.name, b.input)}
                   for b in response.content if b.type == "tool_use"]
        messages.append({"role": "user", "content": results})
    return "Stopped: step budget exhausted"
```

Even a fully hijacked model can't exfiltrate a token (none enters its context), use one outside its scope or audience, pay an unlisted merchant, exceed the cap or skip approval, because those checks run in plain code. What it *can* still do is waste the remaining budget on allowlisted merchants or buy the wrong item within limits, so keep limits tight and approvals informative. In production, keep `spent` in a shared store with atomic updates so parallel workers can't both pass the cap, and back the cap up at the payment layer.

## Human Approval for High-Value Actions

Some actions should never be fully delegated: large payments, new payees, sharing data externally, granting permissions. Beyond the general UX in [Human-in-the-Loop](human-in-the-loop.html), identity adds three requirements:

1. **Approve the action, not the prose.** Render approval from the structured arguments (merchant, amount, recipient), never the model's summary: a hijacked model can describe a $900 transfer as "the $9 renewal you asked for". This is **what you see is what you sign**.
2. **Use a trusted surface** the agent can't draw or click on: the operator's or bank's app, an OS passkey prompt, a CIBA push.
3. **Make high-stakes approval cryptographic.** A passkey signing a hash of the exact action is evidence the user can't plausibly deny and the operator can't forge, which is what payment mandates formalize.

Set thresholds by reversibility and blast radius: small purchases at known merchants within budget can be automatic; new merchants, unusual amounts, or anything after the agent read untrusted content should ask.

## Agent Identity on the Web

On the open web there's no OAuth relationship to lean on. Sites classify traffic by **user-agent strings** (trivial to spoof) and **IP ranges** (brittle and shared), so helpful agents get blocked while scrapers pose as browsers.

### Signed agent requests: Web Bot Auth

**Web Bot Auth** lets an automated client prove *which operator* sent a request by signing it with **HTTP Message Signatures** (RFC 9421, 2024). Cloudflare proposed it in May 2025. The IETF formed a **webbotauth** working group in October 2025, and its protocol document, *HTTP Message Signatures for Bots*, was still an Internet-Draft in late 2026, so details may change.

- The operator publishes its public keys (Ed25519 in the reference implementation) in a **key directory** at `/.well-known/http-message-signatures-directory` on its own domain.
- Each request carries a `Signature-Agent` header pointing there, plus `Signature-Input` and `Signature` headers: an RFC 9421 signature over at least the target authority, with creation and expiry times, a nonce and the tag `web-bot-auth`.
- The site fetches and caches the keys, verifies the signature, rejects replayed nonces, and applies its policy for that operator.

An abbreviated, illustrative request:

```text
GET /products/usb-c-charger HTTP/1.1
Host: shop.example
Signature-Agent: sig1="https://agent.example.com"
Signature-Input: sig1=("@authority" "signature-agent");created=1795430000;expires=1795430300;keyid="<JWK thumbprint>";alg="ed25519";nonce="<random>";tag="web-bot-auth"
Signature: sig1=:<base64 signature>:
```

Visa's **Trusted Agent Protocol** (October 2025, developed with Cloudflare) and Mastercard's Agent Pay build on Web Bot Auth so merchants can recognize registered shopping agents.

Be precise about what a signature proves: the request came from the holder of a key a particular operator published. That gives accountability and a stable identity for rate limits and allowlists. It does *not* prove which user the agent serves, that the user authorized this action, or that the agent behaves well. Privacy is open too: a stable signature makes agents trackable, and the working group is also discussing anonymous variants.

### Verifiable credentials and "know your agent"

Relying parties increasingly want richer claims than "which operator": Is this agent registered with a payment network? Who is accountable for it? The general tool is the **verifiable credential (VC)**: a tamper-evident statement by an issuer about a subject, presentable to anyone who trusts the issuer (the W3C's VC 2.0 family became a Recommendation in 2025). Formats such as **SD-JWT** add **selective disclosure**, revealing only the claims a verifier needs.

Borrowing from banking's *know your customer*, the industry talks about **know your agent (KYA)**. Concrete programs exist mainly at the networks: Mastercard's Agent Pay requires agents to be registered and verified, and Visa has described a directory of verified agents. There's no cross-industry KYA standard as of 2026; treat it as a direction, not a specification.

## Audit Logging and Non-Repudiation

[Guardrails & Sandboxing](guardrails-and-sandboxing.html#auditing) covered tamper-evident logs. Identity raises the bar from "what happened?" to "who authorized it, and can they deny it?". A delegated-action record should hold the principal, the agent identity and version, the grant or mandate ID and scopes, the canonicalized action, the policy decision, any approval with its time and method, the token's `jti` (its unique ID, never the token), and the provenance of untrusted content in context.

**Non-repudiation** means a party can't credibly deny an action. Know what each mechanism gives you:

| Mechanism | Detects tampering? | Proves who acted? | Limits |
|---|---|---|---|
| Hash-chained log | Yes, for edits in the middle | No | Whoever can write the log can rewrite the whole chain |
| HMAC on each entry | Yes, to key holders | No | Anyone with the shared key, including the operator, could have produced it |
| Write-once storage, external anchoring | Yes | No | Proves when a record existed, not who authorized it |
| Signature by the user's own key (passkey, wallet) | Yes | **Yes**, for that party | Only covers what the user actually saw and signed |

Only the last row gives non-repudiation, and only for whoever's key signed. An operator's log, however well protected, is the operator's word, which is why payment protocols put the user's approval of exactly what will be paid into a signature made with the user's key.

## Agentic Payments

Payments concentrate every problem above. Money is hard to claw back, card fraud rules assume a human at checkout, and liability assumes someone can say "yes, I did that". As AP2's overview frames it: what proves the user authorized this purchase, does the request reflect their true intent, and who is accountable when it goes wrong? Several overlapping, sometimes competing efforts launched in 2025 and 2026:

| Effort | Backers | What it standardizes | Status (as of late 2026) |
|---|---|---|---|
| **AP2** (Agent Payments Protocol) | Google; moved to the FIDO Alliance | Signed mandates proving what the user authorized | v0.2 (April 2026), pre-1.0 |
| **ACP** (Agentic Commerce Protocol) | OpenAI and Stripe | Checkout API between agent and merchant, plus delegated payment tokens | Beta, date-versioned spec |
| **UCP** (Universal Commerce Protocol) | Google with Shopify and retailers | The broader shopping workflow (checkout, fulfillment, discounts) | Launched January 2026 |
| **x402** | Coinbase; now the x402 Foundation | Payments inside HTTP using status 402 | Open standard, v2 |
| **Card-network programs** | Visa, Mastercard and others | Agent-specific tokens, agent registration, signed agent traffic | Commercial programs |

### AP2 and payment mandates

Google announced **AP2** on September 16, 2025 as an open extension for A2A and MCP, with dozens of payments and technology partners. Its core idea is the **mandate**: a signed record of what a user authorized. Version 0.1 defined an *intent mandate* (the request and its constraints), a *cart mandate* (exact items and price) and a *payment mandate* (signaling agent involvement to the network).

On April 28, 2026, Google published **AP2 v0.2** and donated the protocol to the **FIDO Alliance**, the standards body behind passkeys, alongside Mastercard's related **Verifiable Intent** specification. Version 0.2 has two mandate types, each *open* or *closed*:

- A **Checkout Mandate** proves to the merchant that the agent may buy *this checkout*. The merchant signs the checkout it offers (as a JWT), and the closed mandate is bound to it by hash.
- A **Payment Mandate** proves to the credential provider, network and processor that the agent may pay *for that checkout*, bound to the same hash so it can't fund a different purchase.
- An **open** mandate carries the user's **constraints** instead: allowed merchants, line items, amount range, budget, number of uses, date window. The user signs it on a non-agentic **Trusted Surface**; it names the agent's public key (a `cnf` claim) and should expire as soon as the task allows. Verifiers always receive **closed** mandates, which describe one transaction.

In **human-present** mode the user signs closed mandates for the exact checkout. In **human-not-present** mode ("two tickets under $300 when sales open"), the user signs open mandates up front and the agent later signs closed ones with its own key; verifiers check that key against the open mandate and the closed mandate against its constraints. Mandates are SD-JWT credentials, so each verifier sees only the constraints it needs.

```mermaid
sequenceDiagram
  participant U as User
  participant TS as Trusted surface
  participant SA as Shopping agent
  participant M as Merchant
  participant CP as Credential provider
  participant PP as Processor and network
  U->>SA: "Two tickets under $300 when sales open"
  SA->>TS: Draft open mandates (constraints, agent key)
  TS->>U: Show constraints, ask for passkey
  U->>TS: Approve with biometric
  TS-->>SA: User-signed open mandates
  Note over SA: Later, tickets go on sale
  SA->>M: Build checkout
  M-->>SA: Merchant-signed checkout JWT
  SA->>SA: Sign closed mandates with agent key
  SA->>CP: Open + closed payment mandate
  CP->>CP: Verify signatures and constraints
  CP-->>SA: Payment credential scoped to this checkout
  SA->>M: Closed checkout mandate + credential
  M->>PP: Authorize payment
  PP-->>M: Approved
  M-->>SA: Signed checkout receipt
```

Three design choices are worth copying even outside payments:

- **The model is in the threat model.** AP2's security considerations state that it "assumes that preventing prompt injection attacks is infeasible" and treat every LLM and agent as a potential attacker; all verification runs in deterministic code.
- **Constraints bound the worst case.** If injection steers the agent to a bad product, the merchant's signature protects the offer's integrity and constraint checks cap the damage.
- **Double spend is explicit.** An agent may not present a new closed mandate under the same open mandate without a receipt rejecting the previous one.

### ACP and delegated payment tokens

OpenAI and Stripe released the **Agentic Commerce Protocol** on September 29, 2025, alongside **Instant Checkout** in ChatGPT. It is Apache-2.0 licensed and versioned by date (the 2026-04-17 release added carts, product feeds, orders, authentication and MCP support). Two pieces matter here:

- An **agentic checkout** API that merchants implement, so an agent can create, update and complete a checkout while the merchant stays **merchant of record**.
- A **delegated payment** spec: the payment provider tokenizes the user's credential with an **allowance** (one-time use, a `max_amount` in minor units, currency, the specific `checkout_session_id` and `merchant_id`, and `expires_at`). The agent never handles the card number. Stripe's comparable primitive is the **Shared Payment Token**.

The allowance is the broker's per-action scoping, enforced by the payment provider. Products move fast: in March 2026 OpenAI scaled back native Instant Checkout, shifting purchases into merchants' own apps inside ChatGPT, while the ACP spec kept evolving. Treat product integrations as provisional and the delegation patterns as durable.

### UCP: the commerce layer

Google introduced the **Universal Commerce Protocol** in January 2026 at the National Retail Federation conference, co-developed with Shopify and endorsed by retailers and payment companies. UCP covers the shopping workflow (capabilities, checkout, fulfillment, discounts, payment handlers), and AP2 is designed as the authorization layer that plugs into it. ACP and UCP overlap at checkout; whether they converge is open.

### x402: payments inside HTTP

HTTP reserved status **402 Payment Required** in the 1990s but never defined it. **x402**, launched by Coinbase in May 2025, gives it a protocol for machine-to-machine payments: paying per API call or per article, with no account or checkout page. Coinbase and Cloudflare announced an x402 Foundation in September 2025, and in 2026 it moved under the Linux Foundation.

In version 2, the exchange looks like this (abbreviated):

```text
GET /premium-data HTTP/1.1
Host: api.example.com

HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: <base64 JSON: x402Version 2, accepts: [{scheme: "exact",
  network: "eip155:8453", amount: "10000", asset: <USDC contract>, payTo: <address>,
  maxTimeoutSeconds: 60}]>

GET /premium-data HTTP/1.1
Host: api.example.com
PAYMENT-SIGNATURE: <base64 JSON: signed authorization to transfer exactly 10000 units to payTo>

HTTP/1.1 200 OK
PAYMENT-RESPONSE: <base64 JSON: settlement result, transaction reference>
```

The server verifies and settles itself or through a **facilitator** (`/verify` and `/settle` endpoints). Payments are mostly in stablecoins such as USDC (`10000` is one cent, at six decimals), with schemes such as `exact` (fixed price) and `upto` (authorize a maximum, settle actual usage).

x402 puts the spend decision in the agent's own runtime, so a broker-style policy is essential: allowlist payees and networks, cap per-request and per-period spend, keep the wallet key outside the model and sandbox, and never let content from a paid resource change the limits.

### Card-network agent programs

The networks are adapting existing rails. **Mastercard Agent Pay** (announced April 29, 2025) introduced **Agentic Tokens** and requires agents to be registered and verified; consumers define what an agent may buy. **Visa Intelligent Commerce** (announced April 30, 2025) gives agents tokenized credentials with consumer-set spending limits, followed by the Trusted Agent Protocol in October 2025. The common pattern is a **network token** scoped to an agent, limitable by amount, merchant and time and revocable without reissuing the user's card, plus a transaction signal that an agent was involved.

> [!KEY] Verifiable delegation, enforced outside the agent
> Every serious payment design records *exactly what the user authorized* in a form the user signed, and enforces limits somewhere the agent can't reach: a mandate verifier, a scoped token, an issuer's controls. The agent proposes; deterministic systems decide.

## Spend Controls, Fraud and Injection

Layer controls so no single failure lets money escape.

| Layer | Control | Catches |
|---|---|---|
| Agent harness | Broker caps, merchant allowlist, approval thresholds, idempotency keys | Hijacked or looping agents, duplicate charges |
| Delegation artifact | Mandate constraints, token allowance (amount, merchant, expiry, one-time use) | An agent exceeding what the user signed |
| Payment credential | Virtual card or network token limits, merchant-category restrictions | A compromised agent platform |
| Issuer and network | Fraud scoring, agent-transaction signals, step-up challenges such as 3-D Secure | Stolen credentials, anomalous patterns |
| Monitoring | Velocity alerts, new-merchant alerts, reconciliation against approvals | Slow leaks and abuse that stays under every individual cap |

Payment-specific attacks to design against:

- **Injected purchasing**: a page or email tells the agent to buy something or "use this faster checkout link". Payees must come from an allowlist or a merchant-signed checkout, never from text the agent read.
- **Price manipulation**: content claims a discount. Only the price in the merchant-signed checkout counts, checked against the user's constraints.
- **Splitting**: many purchases just under the approval threshold. Use aggregate caps per merchant, day and grant.
- **Replay**: a stolen authorization reused elsewhere. Bind it to one checkout, make it single-use and short-lived.
- **Agent impersonation**: a fraudster's bot claims to be a trusted agent. Require signed requests and network registration.
- **Dispute abuse**: a user falsely says "my agent did that". Signed mandates and receipts show what was approved.

> [!WARNING] The agent's own view is not evidence
> Never let the model's description of a purchase serve as the approval record, the fraud signal or the dispute evidence. Use the structured, signed artifacts: the merchant's checkout, the user's mandate, the processor's receipt.

## Regulation and Liability

Payment law and network rules were written for human payers, and as of 2026 the agent cases are mostly unsettled. In the United States, Regulation E (under the Electronic Fund Transfer Act) limits consumer liability for *unauthorized* transfers but excludes transfers by someone the consumer furnished the means of access to, until the consumer revokes that permission. Commentators disagree on whether handing credentials to an AI agent counts, and on how to treat an agent that had access but made a transaction the user didn't intend. In the European Union, **strong customer authentication** (two independent factors) is required for most payer-initiated electronic payments, pushing designs toward the user authenticating at delegation time.

Card networks set their own dispute rules, and analysts generally note that no clear liability shift for agent transactions exists yet. So keep the evidence a dispute needs (what the user approved, where, with which key, and what was charged), make scopes and revocation visible, and get legal review before shipping autonomous purchasing. [Safety, Alignment & Governance](agent-safety-alignment.html) covers the wider regulatory picture.

## Key Takeaways

- Agents need their **own identity**, linked to the user's: act *on behalf of*, never *as*. That enables accountability, least privilege, per-agent revocation and audit.
- **Authentication** proves who; **authorization** decides what. Prefer **delegation** (subject plus actor, as in RFC 8693's `act` claim) over impersonation.
- Delegated OAuth for agents means **authorization code + PKCE**, **narrow scopes**, **audience-bound, short-lived** tokens, vaulted refresh tokens, and **token exchange** at every hop instead of passthrough.
- **MCP** applies OAuth 2.1 strictly: verified PKCE, mandatory resource indicators, audience validation, **step-up authorization** and issuer checks, plus opt-in machine-to-machine and enterprise-IdP extensions.
- **Never put raw secrets in the model's context.** A **credential broker** holds tokens, mints per-call scoped tokens, enforces per-tool and per-action policy (allowlists, spend caps, approvals) in code, and redacts results.
- **Web Bot Auth** (signed requests with published operator keys, still an IETF draft) identifies the operator, not the user's intent.
- Hash chains detect tampering, but only **signatures by the user's own key** give non-repudiation, which is why payment protocols center on **signed mandates**.
- Agent payment protocols (**AP2**, **ACP**, **UCP**, **x402**, card-network programs) are young and moving, but share one principle: verifiable delegation with limits enforced **outside the agent**, assuming the model can be injected.

## Exercises

1. **Scope a real assistant (easy).** For an assistant with Gmail, Google Calendar and a company expense tool, list every tool it needs, the narrowest scope and audience for each, and which calls should require human approval. Which single scope, if over-granted, would do the most damage under prompt injection?
2. **Harden the broker (medium).** Extend `CredentialBroker` with (a) a per-merchant daily cap, (b) a velocity limit of at most three purchases per ten minutes, and (c) a `tainted` flag that the harness sets after any tool returns untrusted content, which forces human approval for every purchase from then on. Write tests that show each rule firing.
3. **Implement PKCE and a resource-bound authorization request (medium).** Using only the Python standard library, generate a code verifier and S256 challenge, build an authorization URL with `scope`, `resource`, `state` and `code_challenge`, and write the check the token endpoint performs when the verifier arrives. Explain what an attacker who steals the authorization code can and can't do.
4. **An x402 spending policy (medium–hard).** Write a function `should_pay(payment_required, policy, ledger)` that decides whether an agent may sign a payment for a 402 response. It should check scheme, network, asset, payee allowlist, a per-request maximum and a rolling daily budget. Where must the wallet key live, and what must never influence the policy?
5. **Design a human-not-present purchase (hard).** A user says: "Buy two tickets for the Saturday show, under $300 in total, from the official box office or its authorized reseller, before Friday." Specify the open mandate constraints, what the merchant and the credential provider each verify, how double spending is prevented, what evidence would settle a dispute, and one attack that still works within your constraints.

<details class="solutions">
<summary>Hints and solution sketches</summary>

1. **Hint:** Separate read from write, and ask which write can send data to an outsider or move money. Reading the inbox is low-privilege but brings in untrusted content.

    **Sketch:** A reasonable plan:
    - `search_mail` and `read_message`: `gmail.readonly`, audience the Gmail API, allowed, but their output is untrusted.
    - `create_draft`: `gmail.compose`, allowed (a draft sends nothing).
    - `send_mail`: `gmail.send`, ask, with the exact recipients and body shown.
    - `list_events`: `calendar.events.readonly`, allowed.
    - `create_event` and `move_event`: `calendar.events`, allowed for the user's own calendar, ask when external attendees will be notified.
    - `submit_expense`: an expense-API scope limited to the user's own reports, ask above a threshold.

    The most dangerous over-grant is full mail access (`https://mail.google.com/`), which includes sending and permanent deletion. Combined with untrusted inbound mail, it completes the lethal trifecta. Note that Google treats several mail scopes as restricted, which adds verification requirements for apps that request them.

2. **Hint:** Keep the new state in the broker (a deque of purchase timestamps and a dict of per-merchant daily totals) and make every rule a branch in `check`, so `run` audits it automatically. The taint flag belongs to the harness, which knows which tools return untrusted content.

    **Sketch:** Tests: three purchases succeed, and the fourth within ten minutes is blocked; with a $50 daily cap at merchant A, $30 + $25 is blocked at the second call while $30 at merchant B passes; after `broker.tainted = True`, even a $2 purchase calls `approve`. In production, keep counters in a shared store with atomic increments so parallel workers can't race past a cap.

    ```python
    import collections, datetime, time
    from decimal import Decimal

    class HardenedBroker(CredentialBroker):
        def __init__(self, *args, merchant_daily_cap: Decimal, **kw):
            super().__init__(*args, **kw)
            self.merchant_daily_cap, self.tainted = merchant_daily_cap, False
            self.recent: collections.deque[float] = collections.deque()
            self.daily: dict[tuple[str, str], Decimal] = collections.defaultdict(Decimal)

        def check(self, name, args):
            spec = self.tools.get(name)
            if spec and spec.spends:
                now, day = time.time(), datetime.date.today().isoformat()
                while self.recent and self.recent[0] < now - 600:
                    self.recent.popleft()
                amount, key = Decimal(str(args.get("amount", "0"))), (args.get("merchant"), day)
                if len(self.recent) >= 3:
                    return "velocity limit: at most 3 purchases per 10 minutes"
                if self.daily[key] + amount > self.merchant_daily_cap:
                    return "daily cap for this merchant reached"
                if self.tainted and not self.approve(self.grant, args):
                    return "untrusted content in context; the user declined"
            reason = super().check(name, args)
            if reason is None and spec and spec.spends:   # record only purchases that will run
                self.recent.append(time.time())
                self.daily[(args.get("merchant"), datetime.date.today().isoformat())] += Decimal(str(args["amount"]))
            return reason
    ```

    One subtlety: when `tainted` is set and the amount is also above `approve_above`, this version asks twice. Merge the two approval conditions if that matters for your UX.

3. **Hint:** The verifier is 43 to 128 characters of URL-safe randomness, and the challenge is the unpadded base64url encoding of its SHA-256 digest. The token endpoint recomputes the challenge from the verifier and compares the two in constant time.

    **Sketch:** An attacker holding only the code can't redeem it, because they don't have the verifier. They also can't swap in their own code (injection), because the legitimate client's verifier won't match the challenge bound to the attacker's code. PKCE doesn't protect a token after it's issued, which is what audience binding, short lifetimes and sender-constraining are for.

    ```python
    import base64, hashlib, hmac, secrets
    from urllib.parse import urlencode

    def b64url(raw: bytes) -> str:
        return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()

    verifier = b64url(secrets.token_bytes(32))                    # 43 characters
    challenge = b64url(hashlib.sha256(verifier.encode()).digest())
    url = "https://auth.example.com/authorize?" + urlencode({
        "response_type": "code", "client_id": "https://agent.example.com/client.json",
        "redirect_uri": "http://127.0.0.1:8765/callback", "scope": "calendar.events",
        "resource": "https://calendar.example.com", "state": secrets.token_urlsafe(16),
        "code_challenge": challenge, "code_challenge_method": "S256"})

    def token_endpoint_check(stored_challenge: str, presented_verifier: str) -> bool:
        recomputed = b64url(hashlib.sha256(presented_verifier.encode()).digest())
        return hmac.compare_digest(recomputed, stored_challenge)
    ```

4. **Hint:** Decode the `PAYMENT-REQUIRED` header, iterate over `accepts`, and choose the first option your policy allows. Amounts are strings in the asset's smallest unit, so convert using the asset's decimals and never use floats.

    **Sketch:** The wallet key lives in a signer service outside the model and the sandbox, and that service applies the same policy again before signing (defense in depth). The resource's description, error text and any content returned by paid endpoints must never change the policy or the budget. A page saying "your limit has been raised" is just untrusted text. Log every signed payment with the resource URL, payee and amount for reconciliation.

    ```python
    import time
    from decimal import Decimal

    def should_pay(payment_required: dict, policy: dict, ledger: list[tuple[float, Decimal]]) -> dict | None:
        day_ago = time.time() - 86_400
        spent_today = sum(amount for ts, amount in ledger if ts > day_ago)
        for option in payment_required.get("accepts", []):
            asset = policy["assets"].get((option.get("network"), option.get("asset")))
            if asset is None or option.get("scheme") != "exact":
                continue                                   # unknown network, asset or scheme
            if option.get("payTo") not in policy["payees"]:
                continue
            amount = Decimal(option["amount"]).scaleb(-asset["decimals"])  # atomic units -> dollars
            if amount <= policy["max_per_request"] and spent_today + amount <= policy["daily_budget"]:
                return option                              # caller signs this option and records it
        return None
    ```

5. **Hint:** Work through the AP2 v0.2 concepts in turn: open Checkout and Payment Mandates with constraints, the agent's key in `cnf`, a short `exp`, a merchant-signed checkout, and closed mandates bound by hash. Then ask what the constraints *can't* express.

    **Sketch:**
    - **Open Checkout Mandate:** allowed merchants (the box office and the named reseller), line items (two tickets for the Saturday show), the agent's public key, expiry Friday 23:59.
    - **Open Payment Mandate:** allowed payees (the same two merchants), an amount range with a maximum of $300, single use (or a budget of $300 with one recurrence), an allowed payment instrument, a reference to the open Checkout Mandate, and the same expiry.
    - **Merchant verifies:** the agent's signature on the closed Checkout Mandate, that the key matches the user-signed open mandate, that its `checkout_hash` matches the merchant's own latest signed checkout, and that the line-item and merchant constraints are satisfied.
    - **Credential provider verifies:** the user's signature on the open Payment Mandate, the agent's signature on the closed one, the binding between them (`sd_hash`), the amount and payee against the constraints, and that the mandate hasn't expired or already been used. Only then does it release a credential scoped to this transaction.
    - **Double spend:** the agent can't present another closed mandate under the same open mandate without a rejection receipt for the previous one, and the credential provider tracks usage and may reject overlapping mandates.
    - **Dispute evidence:** the user-signed open mandates, the agent-signed closed mandates, the merchant-signed checkout, and the checkout and payment receipts.
    - **Residual attack:** injected content (a fake "official seat map") steers the agent toward the worst seats or an inflated-fee listing that still fits under $300 at an allowed merchant. Constraints bound the loss but can't express "best value". Mitigations: tighter constraints (section, maximum price per ticket), or a human-present confirmation if the price exceeds the user's typical range.

</details>

## Check Your Understanding

```quiz
Q: A shopping agent's spend cap is written in its system prompt ("never spend more than $100"). Why is that insufficient?
- [ ] The model can't do reliable arithmetic on currency amounts across many purchases
- [x] Injected text can override a prompt, so the cap must be enforced in code
- [ ] Payment APIs ignore any spending limit that doesn't arrive in a signed mandate
- [ ] System prompts are silently dropped from context once a conversation grows long
E: A prompt is a probabilistic request to a model that may be hijacked. A cap enforced by the broker, or by the payment token's allowance or issuer controls, holds no matter what the model was persuaded to do. Arithmetic errors and context limits are real, but the core problem is that the control lives where the attacker's text can reach it.

Q: What does PKCE protect against in the authorization code flow?
- [ ] An access token being replayed at a different API than the one intended
- [ ] The user approving broader scopes than the agent really needs for the task
- [x] A stolen authorization code being redeemed without the verifier
- [ ] A refresh token being read from the agent host's storage by local malware
E: The client sends a hash of a secret verifier with the authorization request and must present the verifier to redeem the code, so an intercepted code is useless. Replay at another API is addressed by audience binding, over-broad consent by scope design, and refresh-token theft by vaulting, rotation and sender-constraining.

Q: An MCP server answers a tool call with 403 and `error="insufficient_scope", scope="files:write"`. The client already holds a `files:read` token. What should it do?
- [ ] Retry the call with the same token, since 403 responses are usually transient
- [ ] Forward the user's upstream API token, which already includes write access
- [ ] Request a new token for files:write only, replacing the read token entirely
- [x] Re-authorize for files:read plus files:write, then retry a few times
E: The MCP spec describes step-up authorization: the client requests the union of its previous scopes and the challenged ones, so it keeps the permissions it already had, then retries a bounded number of times. Forwarding an upstream token is forbidden token passthrough, and requesting only the new scope would break operations that need read.

Q: In RFC 8693 token exchange, what is the purpose of the `act` claim in the issued token?
- [ ] It lists the actions the token may perform, replacing the older scope claim
- [x] It records who acts for the subject: delegation, not impersonation
- [ ] It names the API audience that must accept the newly exchanged token
- [ ] It marks the token as single-use so it can't be exchanged a second time
E: `sub` identifies the user and `act` identifies the actor (for example, the agent), so downstream services and audit logs can tell "the agent did this for Alice" apart from "Alice did this". Permissions stay in `scope` and the audience in `aud`.

Q: A website verifies a valid Web Bot Auth signature on a shopping agent's request. What has it learned?
- [ ] The user behind the agent approved the purchase being attempted
- [x] The request was signed with a key that a named operator published
- [ ] The agent's model passed a prompt-injection robustness evaluation
- [ ] The traffic comes from a residential IP address, not from a data center
E: The signature ties the request to the holder of a key listed in the operator's published directory, which gives accountability and a stable identity for policy. It says nothing about the user's authorization (that's what mandates and tokens are for), the agent's robustness, or network location.

Q: In AP2 v0.2's human-not-present mode, why can a merchant trust a closed Checkout Mandate signed by the agent's key rather than the user's?
- [ ] The merchant's own LLM reviews the order and confirms it looks reasonable
- [ ] Agent keys are issued by card networks, which accept liability for misuse
- [x] A user-signed open mandate names that agent key and its constraints
- [ ] The agent's provider signs every closed mandate on behalf of all its users
E: The user signs the open mandate on a trusted surface, and it includes the agent's public key (`cnf`), the constraints and an expiry. The verifier checks that the closed mandate was signed by that key and satisfies those constraints, all in deterministic code. AP2 requires verification to be non-agentic, and trusting an agent provider is a separate, optional trust model rather than the reason.

Q: Your agent platform keeps a hash-chained, append-only log of every purchase. A customer disputes a charge, saying they never approved it. What can the log alone not establish?
- [ ] Whether entries were edited after being written, in the middle of the chain
- [ ] The order in which the agent's tool calls happened during the session
- [ ] Which tool the agent called, with what arguments and policy decision
- [x] That the customer personally authorized it, rather than the platform
E: A hash chain is evidence controlled by whoever writes the log, so it shows tampering and sequence but not who authorized the action. Non-repudiation needs a signature made with a key only the customer holds, such as a passkey signature on a mandate, which is why payment protocols put the user's approval into a signed artifact.
```

## Further Reading

- [MCP Authorization specification (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) — the normative rules for PKCE, resource indicators, scope challenges and step-up authorization.
- [MCP Enterprise-Managed Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) — how ID-JAG and token exchange put an enterprise IdP in charge of agent access.
- [RFC 8693: OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693) — subject and actor tokens, and the `act` claim for delegation.
- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700) — the consolidated threat model and mitigations every OAuth client should follow.
- [RFC 9421: HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421) — the signing standard underneath Web Bot Auth.
- [IETF Web Bot Auth working group](https://datatracker.ietf.org/group/webbotauth/about/) — charter, current drafts and the status of signed agent traffic.
- [Agent Payments Protocol (AP2) repository](https://github.com/google-agentic-commerce/AP2) — the v0.2 specification (checkout and payment mandates, security considerations) and samples.
- [Agentic Commerce Protocol repository](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol) — checkout and delegated-payment specs, versioned by date.
- [x402 repository](https://github.com/x402-foundation/x402) — the HTTP 402 payment flow, schemes and reference SDKs.
