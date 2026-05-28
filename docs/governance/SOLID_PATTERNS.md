# SOLID Principles & Design Patterns

**Authority**: AGENTS.md § 10
**Status**: ✅ CURRENT

---

## 1. SOLID Principles

### S — Single Responsibility (SRP)
Each module has one reason to change. Layers are isolated by concern.

### O — Open/Closed (OCP)
Extend behavior via **composition** and **custom hooks**, not by modifying existing code.

### L — Liskov Substitution (LSP)
Components and hooks are interchangeable within their domains (e.g., atoms conform to common interfaces).

### I — Interface Segregation (ISP)
Interfaces are fine-grained; components depend only on what they use. Use barrel patterns to expose minimal public APIs.

### D — Dependency Inversion (DIP)
High-level modules (UI) depend on abstractions (Hooks/Context), not low-level details (Domain).

---

## 2. Key Design Patterns

| Pattern                  | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| **CLEAN Architecture**   | Layered separation (Domain → App → UI)              |
| **Atomic Design**        | Component hierarchy (atoms → molecules → organisms) |
| **Barrel Pattern**       | `index.ts` re-exports public APIs                   |
| **Composition Pattern**  | Atoms compose into larger components                |
| **Custom Hooks Pattern** | Encapsulate logic for reuse                         |
| **Context Pattern**      | Shared state without prop drilling                  |

---

## 3. DRY (Don't Repeat Yourself)

- **Reuse hooks** for shared logic.
- **Centralize business rules** in the domain layer.
- **Use CSS variables** and shared themes.
- **Never duplicate components**; extract shared patterns into atoms.
