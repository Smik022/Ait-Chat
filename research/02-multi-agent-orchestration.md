# Multi-Agent Orchestration Research

**BRD relevance:** §1.2 (agent workforce), §3 (Multi-Agent Orchestration Engine), §4 (agent definitions), §6 FR-07 (dynamic conversation transfer)

**Key finding up front:** The 2026 agent-framework market has consolidated to ~5 production frameworks. The BRD's "Router Agent → specialized agents → Manager Agent" design maps directly to the proven **supervisor pattern** (a.k.a. orchestrator/supervisor + workers), which is well documented in LangGraph and available as `create_supervisor`.

---

## 1. Framework Landscape (2026)

| Framework | Execution model | Sweet spot | Language | Provider stance | Notes |
| --- | --- | --- | --- | --- | --- |
| **LangGraph** | Graph / state machine | Deterministic, auditable, durable, human-in-the-loop | Python, JS/TS | Provider-agnostic | Enterprise default; checkpointing per node; LangSmith observability; ~34.5M monthly PyPI downloads |
| **CrewAI** | Role-based teams | Fastest prototype; team metaphor (roles/goals/backstories) | Python | Provider-agnostic | ~5.2M monthly downloads; Flows add graph-like control; risk of token-burning loops (documented $414 single run) |
| **OpenAI Agents SDK** | Agent + handoffs | GPT-centric support-style routing; minimal ceremony | Python, JS/TS | OpenAI-native | Guardrails + sessions + hosted tools |
| **Google ADK** | Code-first hierarchies | Multimodal, GCP/Vertex, A2A | Python, Java | Gemini-native | |
| **Microsoft Agent Framework** | Agent + workflows | Azure/.NET estates; GA'd merger of AutoGen + Semantic Kernel (2026) | Python, .NET | Azure-native | The AutoGen successor — important because the BRD lists "Userbot" as competitor using multi-agent tech |
| Mastra | ReAct + graph (.then/.branch/.parallel) | TypeScript, serverless | TS | Provider-agnostic | Agent Networks LLM-routing |

**Three execution models:** graph (you draw the flow), crew (you define roles, framework coordinates), handoff (agents pass control). Most production systems mix them.

---

## 2. The Supervisor Pattern (recommended for this product)

Structure: an orchestration Router agent that does not do hands-on work; specialist Worker agents each with a lean toolset.

```
                     ┌─────────────────────────────┐
 customer message →  │  ROUTER AGENT (supervisor)  │  classifies intent, sentiment, language
                     └─────────────┬───────────────┘
            ┌───────────────┬──────┴────────┬────────────────┐
            ▼               ▼               ▼                ▼
       SALES AGENT     SUPPORT AGENT   RETENTION AGENT   OPERATIONS AGENT
      (catalog, cart)  (orders, FAQ)   (upsell, offers)  (inventory, CRM)
            │               │               │                │
            └───────────────┴──────┬────────┴────────────────┘
                                   ▼
                          MANAGER AGENT (governance, approvals)
                                   ▼
                          HUMAN AGENT INBOX (handoff)
```

Why it fits the BRD (matches §4 exactly):
- **Routing**: supervisor decides which worker based on intent classification. LangGraph tutorial evidence: tool-selection errors dropped to 1/3 after moving to a supervisor + workers split; debugging traceable layer by layer.
- **Handoffs / dynamic transfer (FR-07)**: workers can return to the supervisor which re-routes (e.g., Sales → Support on a return request), or use direct agent-to-agent handoff tools.
- **Lean toolsets**: each worker only exposes its own tools (Sales: product search, cart; Support: order lookup, refund-eligibility check; Operations: inventory sync). This *is* the BRD's Guardrail-Protected Tool Gateway (§3) applied per-agent.
- **Escalation triggers (§4)**: negative sentiment / unknown intent → route to Manager; "direct demand for human" → bypass to human inbox. All encodable as router rules.

Pattern variants (LangGraph docs): supervisor, swarm (peer-to-peer, no leader — e.g., sales↔retention conversations), pipeline. Hierarchical teams (sub-supervisors) exist for scale-out.

---

## 3. Framework-by-Framework Assessment for THIS Product

### LangGraph — recommended production choice
- Explicit `StateGraph`, typed state, conditional edges — routing, cycles, retries are first-class.
- **Durable execution**: checkpoints after every node (Postgres/SQLite/memory, thread-scoped) → long conversations survive crashes; **human-in-the-loop** via `interrupt_before`/`interrupt_after` — exactly what a Manager-Agent approval gate needs (approve a refund, apply a discount).
- **Time-travel debugging** (LangGraph Studio), replay from any checkpoint.
- Subgraphs, `langgraph-swarm`, `RemoteGraph` for cross-network agents.
- Per-node timeouts (v1.2+) — supports the BRD's "fallback if API latency > 3s" guardrail at workflow level.
- Cost: LangGraph Platform $0.001/node; OSS core MIT.
- Weakness: steeper learning curve; graph is verbose vs CrewAI.

### CrewAI — recommended for prototyping / MVP speed
- `Agent` (role/goal/backstory) + `Task` + `Crew`; ~20 lines for a working team; processes: sequential / hierarchical / consensual.
- Flows (`@start`/`@listen`/`@router`) add deterministic control — the mature pattern is "Flows outside, Crews inside".
- Agent-to-Agent (A2A) + MCP support in v1.10.1.
- Weaknesses: delegation loops, no built-in token budget limiter (documented uncapped-loop cost), black-box debugging; "agents agreed on an order" is not evidence-able for regulated flows.

### Microsoft Agent Framework (AutoGen successor) — relevant to competitor positioning
- The BRD's competitor "Userbot" sells multi-agent orchestration; the underlying tech trend (AutoGen → Microsoft Agent Framework, GA 2026) shows multi-agent orchestration is commoditizing. This supports the BRD's "simplify setup into a no-code UI" strategic response.

---

## 4. Router Agent Implementation Guidance

- **Prefer an LLM router with a structured-output/tool contract** over bare conditional edges when routing depends on unstructured text (intent, sentiment, code-switching).
- **RoutingTool pattern**: dedicated tool stores the decision in state; the RouterAgent calls it, downstream workers read it. Testable, auditable.
- **`forward_message_tool`** (LangGraph): pass the customer message to the worker verbatim instead of having the router summarize → saves tokens, preserves fidelity.
- **Cost controls**: cap conversation rounds per session; limit tools per worker; use round/message termination conditions (AutoGen teams: `MaxMessageTermination`).
- **Observability**: LangSmith traces per node; OTel GenAI semantic conventions for per-agent cost/latency dashboards. Required to debug "which agent said what."

---

## 5. MCP and A2A — de-risking the choice

- **MCP** (Model Context Protocol) standardizes how agents reach tools → tool sets (Shopify adapter, knowledge base, payment links) become portable across frameworks.
- **A2A** (Agent-to-Agent) standardizes inter-agent calls → framework choice is reversible. Explicit advice from 2026 sources: "the framework is swappable glue — not a bet-the-company decision."

Recommendation: **put business logic outside the framework** (domain adapters + guardrail gateway), pick **LangGraph for the production orchestration spine** (auditable routing, durable conversations, approval interrupts), and consider **CrewAI or the OpenAI Agents SDK for fast prototyping** specific workflows.

---

## Sources
- agentsindex.ai — "CrewAI vs LangGraph" (2026-03)
- jacar.es — "Multi-agent systems: LangGraph vs CrewAI vs Autogen" (2026-05)
- agentmelt.com — "AI Agent Frameworks Compared (2026)" (2026-08)
- appinventiv.com — "LangGraph vs CrewAI vs Claude Agent SDK" (2026-08)
- speakeasy.com — "LangChain vs LangGraph vs CrewAI vs PydanticAI vs Mastra" (2026-03)
- abstractalgorithms.dev — "Multi-Agent Systems in LangGraph: Supervisor Pattern, Handoffs, Agent Networks"
- eastondev.com — "LangGraph Supervisor Tutorial" (2026-05)
- dev.to/irubtsov — "Three LangGraph Agent Patterns" (2026-02)
