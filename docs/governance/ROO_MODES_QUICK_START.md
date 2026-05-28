# Roo Code Modes Quick Start

**Authority**: AGENTS.md § 1.A (Roo Mode Configuration)  
**Updated**: May 2, 2026  
**Purpose**: Quick reference for all 15 workspace Roo modes

---

## 🎯 Quick Mode Selection

| Need | Mode | Command |
|------|------|---------|
| **Fix merge conflicts** | 🔀 Merge Resolver | "Use merge-resolver mode" |
| **Sync/repair governance** | 🛡️ Governance Sync | "Use governance-sync mode" |
| **Write documentation** | ✍️ Documentation Writer | "Use documentation-writer mode" |
| **Research codebase** | 🔍 Project Research | "Use project-research mode" |
| **Security audit** | 🛡️ Security Reviewer | "Use security-review mode" |
| **DevOps/deploy** | 🚀 DevOps | "Use devops mode" |
| **Learn programming** | 💡 Coding Teacher | "Use coding-teacher mode" |
| **Create user stories** | 📝 User Story Creator | "Use user-story-creator mode" |
| **Create/edit modes** | ✍️ Mode Writer | "Use mode-writer mode" |

---

## 📋 Complete Mode Inventory (15 Modes)

### **Workspace-Scoped Modes** (Highest Priority)

#### 🔀 **Merge Resolver**
**Purpose**: Resolve merge conflicts intelligently using git history  
**When to use**: PR merge conflicts, resolving code intent from commit history  
**File restrictions**: Git files, GitHub config, lock files only  
**Key trigger**: "I have a merge conflict"  
**Example**: `"Use merge-resolver mode and resolve #123 conflicts using commit history"`

#### 🛡️ **Governance Sync**
**Purpose**: Sync/extend/repair governance; restore damaged scripts or config  
**When to use**: Governance drift repair, script restoration, policy alignment  
**File restrictions**: `.roomodes`, `.roo/rules-governance-sync/`, AGENTS.md, docs/governance/  
**Key trigger**: "My governance/scripts are out of sync"  
**Permissions**: read + edit (restricted) + command  
**Example**: `"Use governance-sync mode to update WORKSPACE_SCRIPTS.md with test:ws"`

#### ✍️ **Documentation Writer**
**Purpose**: Create/update technical documentation (READMEs, API docs, guides)  
**When to use**: Updating docs, writing README files, creating guides  
**File restrictions**: README.md, docs/, CHANGELOG.md only  
**Key trigger**: "Update the documentation"  
**Permissions**: read + edit (restricted) + command  
**Example**: `"Use documentation-writer mode to update the installation guide"`

#### 🔍 **Project Research**
**Purpose**: Investigate codebase structure, analyze architecture, research implementations  
**When to use**: Understanding how features work, onboarding, research tasks  
**File restrictions**: Read-only (entire codebase)  
**Key trigger**: "How does feature X work?" or "Understand the codebase for..."  
**Permissions**: read only  
**Example**: `"Use project-research mode to understand how the game engine factory works"`

#### 🛡️ **Security Reviewer**
**Purpose**: Audit code for security vulnerabilities, find exposed secrets, flag boundary violations  
**When to use**: Security audits, finding secrets, architecture security review  
**File restrictions**: compliance/, docs/*security*, ENVIRONMENT.md  
**Key trigger**: "Audit for security issues"  
**Permissions**: read + edit (restricted) + command  
**Example**: `"Use security-review mode and audit all apps for exposed environment variables"`

#### 🚀 **DevOps**
**Purpose**: Deploy, manage infrastructure, CI/CD automation, container orchestration  
**When to use**: Deployment, infrastructure setup, CI/CD configuration  
**File restrictions**: ci/, scripts/, Dockerfile, k8s/, terraform/, ansible/  
**Key trigger**: "Deploy the app" or "Set up CI/CD"  
**Permissions**: read + edit (restricted) + command  
**Example**: `"Use devops mode to set up GitHub Actions for the release pipeline"`

#### 💡 **Coding Teacher**
**Purpose**: Learn programming concepts, understand patterns, guided instruction  
**When to use**: Learning, understanding code patterns, educational sessions  
**File restrictions**: Read + edit + browser access  
**Key trigger**: "Teach me about..." or "How do I...?"  
**Permissions**: read + edit + browser + command  
**Example**: `"Use coding-teacher mode and teach me about the CLEAN architecture pattern"`

#### 📝 **User Story Creator**
**Purpose**: Create well-structured agile user stories with acceptance criteria  
**When to use**: Breaking down requirements, sprint planning, feature definition  
**File restrictions**: Read + edit  
**Key trigger**: "Create a user story for..."  
**Permissions**: read + edit + command  
**Example**: `"Use user-story-creator mode to break down the HamburgerMenu feature"`

#### ✍️ **Mode Writer**
**Purpose**: Create or edit Roo Code modes with validation  
**When to use**: Creating new modes, modifying existing modes  
**File restrictions**: `.roomodes`, `.roo/`, YAML files  
**Key trigger**: "Create a new Roo mode" or "Edit mode configuration"  
**Permissions**: read + edit (restricted) + command + MCP  
**Example**: `"Use mode-writer mode to create a new mode for game development"`

---

### **Global Modes** (Available if not overridden locally)

#### Default Roo Modes
(Beyond the scope of this project; use workspace modes above)

---

## 🔑 Mode Permissions Reference

| Mode | Read | Edit | Edit Scope | Command | MCP | Browser |
|------|------|------|-----------|---------|-----|---------|
| merge-resolver | ✅ | ⚠️ | git/ | ✅ | ✅ | - |
| governance-sync | ✅ | ⚠️ | governance/ | ✅ | - | - |
| documentation-writer | ✅ | ⚠️ | docs/ | ✅ | - | - |
| project-research | ✅ | - | - | - | - | - |
| security-review | ✅ | ⚠️ | compliance/ | - | - | - |
| devops | ✅ | ⚠️ | ci/scripts/ | ✅ | - | - |
| coding-teacher | ✅ | ✅ | all | ✅ | - | ✅ |
| user-story-creator | ✅ | ✅ | all | ✅ | - | - |
| mode-writer | ✅ | ⚠️ | .roomodes/.roo/ | ✅ | ✅ | - |

---

## 🚀 Common Workflows

### **Workflow 1: Governance Repair**
```
Start: governance-sync mode
1. Read AGENTS.md to understand governance
2. Identify drift in governance files
3. Update AGENTS.md or instruction files
4. Validate changes with pnpm validate
5. Commit with conventional message
```

### **Workflow 2: Feature Documentation**
```
Start: documentation-writer mode
1. Research feature in project-research mode first (read-only)
2. Switch to documentation-writer mode
3. Write README or API documentation
4. Link to related docs
5. Commit documentation changes
```

### **Workflow 3: Security Audit**
```
Start: security-review mode
1. Define audit scope (all apps or specific areas)
2. Scan for secrets, env leaks, monoliths
3. Flag boundary violations
4. Recommend mitigations
5. Update compliance documentation
```

### **Workflow 4: Learning New Pattern**
```
Start: coding-teacher mode
1. Ask "Teach me about [pattern]"
2. Teacher explains concept with examples
3. Ask clarifying questions
4. Teacher guides you through implementation
5. Apply learning to your code
```

### **Workflow 5: Create New Game**
```
Start: game-engine-factory-orchestrator skill (or default mode)
1. Use project-research to understand game architecture
2. Switch to default mode for implementation
3. Use pnpm gen:game-app scaffolding
4. Validate with governance-sync mode
5. Test with testing-quality-gate-runner skill
```

---

## 📊 Mode File Restrictions (Security)

### **governance-sync**
```regex
(\.roomodes$|\.roo/rules-governance-sync/.*\.xml$|AGENTS\.md$|
 CLAUDE\.md$|OPENAI\.md$|\.github/(ai-runtime-policy|copilot-instructions)\.md$|
 \.github/instructions/.*\.md$|\.github/skills/README\.md$|docs/governance/.*\.md$)
```
**Why**: Prevents accidental changes to non-governance code

### **documentation-writer**
```regex
(^README.*\.md$|^docs/.*\.md$|^CHANGELOG.*\.md$)
```
**Why**: Prevents editing source code while writing docs

### **merge-resolver**
```regex
(\.git/|^\.github/|^\.gitignore$|^package\.json$|^pnpm-lock\.yaml$)
```
**Why**: Limits to git-related files for conflict resolution

### **devops**
```regex
(^ci/.*|^\.github/(workflows|actions)/.*|^scripts/.*\.(sh|mjs|js)$|
 ^Dockerfile.*|^docker-compose.*\.yml$|^k8s/.*|^terraform/.*|^ansible/.*)
```
**Why**: Protects app code, limits to deployment/script files

---

## 🔍 Mode Discovery & Activation

### **In Roo Code IDE**
```
Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
→ "Roo: Switch Mode"
→ Select mode from list (15 workspace modes + global modes)
```

### **From Command Line (if supported)**
```bash
# Switch to governance-sync mode
roo mode governance-sync

# List all available modes
roo mode list
```

### **Programmatic Access**
- Modes are defined in `.roomodes` (YAML)
- Each mode has:
  - `slug`: Machine-readable identifier
  - `name`: Display name with emoji
  - `roleDefinition`: AI instruction prompt
  - `groups`: Permissions (read/edit/command/mcp)
  - `fileRegex`: Edit scope restrictions (if any)

---

## 🎓 Mode Development Patterns

### **Pattern: Preservation-First Mode**
Used for sensitive work (governance, security, infrastructure):
- Minimal scope (limited file access)
- Clear role definition
- Built-in guardrails
- Prefer path or case correction over deletion when a fixable wiring problem is detected
- Never purge directories to "simplify" a project unless the directory is proven unused and removal is verified
- If an entrypoint or import path looks wrong, correct the case or target first; do not delete the folder structure as a first response
- Example: `governance-sync` mode

### **Pattern: Unrestricted Exploration Mode**
Used for learning and experimentation:
- Full codebase read access
- Guided instruction
- Questions over commands
- Example: `project-research`, `coding-teacher` modes

### **Pattern: Command-Focused Mode**
Used for operational tasks:
- Structured commands
- Limited decision points
- MCP access for tool integration
- Example: `devops`, `merge-resolver` modes

---

## 🔗 Related Documentation

- **AGENTS.md** — Complete governance (§ 1.A for skills orchestration)
- **docs/governance/AI_TOOLS_DISCOVERY.md** — Complete skill inventory
- **.roomodes** — Canonical mode configuration (this file's source)
- **.roo/rules-governance-sync/** — XML instructions for governance-sync mode
- **.github/instructions/** — Scoped instructions for all tasks

---

## ✅ Mode Checklist for New Work

Before starting any substantial work in a mode, verify:

- [ ] Selected correct mode for the task
- [ ] Understood file restrictions (if any)
- [ ] Read the mode's `roleDefinition` (AI instructions)
- [ ] Reviewed examples in this guide
- [ ] Have a clear success criteria
- [ ] Plan to validate with `pnpm validate` or quality gates

---

**Last Updated**: May 2, 2026  
**Authority**: AGENTS.md § 1.A (Roo Mode Configuration)
