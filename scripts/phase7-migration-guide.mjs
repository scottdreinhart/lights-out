#!/usr/bin/env node
/**
 * Phase 7: Dialog Pattern Migration Guide
 * 
 * This script documents how to migrate common dialog patterns to use
 * centralized ConfirmDialog, AlertDialog, and FormModal from @games/ui-utils
 * 
 * Usage: node scripts/phase7-migration-guide.mjs
 */

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                     PHASE 7: COMMON DIALOG PATTERNS                           ║
║                         Migration Guide & Examples                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

NEW COMPONENTS AVAILABLE IN @games/ui-utils:
  ✓ ConfirmDialog   — Yes/No confirmation (delete, unsaved changes, etc.)
  ✓ AlertDialog     — Single-action alert (errors, warnings, info, success)
  ✓ FormModal       — Form input with submit/cancel

═════════════════════════════════════════════════════════════════════════════════

MIGRATION EXAMPLES:

1. CONFIRM DIALOG - Replace custom yes/no dialogs
   ────────────────────────────────────────────────────────────

   BEFORE (Custom implementation - ~30 LOC):
   ┌─────────────────────────────────────────────────────────┐
   │ function DeleteGameDialog({ isOpen, onConfirm, onCancel }) {
   │   return (
   │     <div className={styles.backdrop} onClick={onCancel}>
   │       <div className={styles.modal} onClick={e => e.stopPropagation()}>
   │         <h2>Delete Game?</h2>
   │         <p>This cannot be undone.</p>
   │         <div className={styles.actions}>
   │           <button onClick={onCancel}>Keep</button>
   │           <button onClick={onConfirm} className={styles.danger}>Delete</button>
   │         </div>
   │       </div>
   │     </div>
   │   )
   │ }
   └─────────────────────────────────────────────────────────┘

   AFTER (Using ConfirmDialog - ~3 LOC):
   ┌─────────────────────────────────────────────────────────┐
   │ import { ConfirmDialog } from '@games/ui-utils'
   │
   │ <ConfirmDialog
   │   isOpen={showDelete}
   │   title="Delete Game"
   │   message="This saved game will be permanently deleted."
   │   confirmLabel="Delete"
   │   cancelLabel="Keep"
   │   isDangerous={true}
   │   onConfirm={handleDelete}
   │   onCancel={() => setShowDelete(false)}
   │ />
   └─────────────────────────────────────────────────────────┘

   SAVINGS: ~27 LOC per app × 50 apps = ~1,350 LOC

═════════════════════════════════════════════════════════════════════════════════

2. ALERT DIALOG - Replace error/info messages
   ───────────────────────────────────────────

   BEFORE (Custom implementation - ~25 LOC):
   ┌─────────────────────────────────────────────────────────┐
   │ function ErrorAlert({ isOpen, message, onClose }) {
   │   return (
   │     <div className={styles.backdrop} onClick={onClose}>
   │       <div className={styles.alertModal}>
   │         <div className={styles.errorIcon}>✕</div>
   │         <h2>Error</h2>
   │         <p>{message}</p>
   │         <button onClick={onClose}>OK</button>
   │       </div>
   │     </div>
   │   )
   │ }
   └─────────────────────────────────────────────────────────┘

   AFTER (Using AlertDialog - ~2 LOC):
   ┌─────────────────────────────────────────────────────────┐
   │ import { AlertDialog } from '@games/ui-utils'
   │
   │ <AlertDialog
   │   isOpen={showError}
   │   type="error"
   │   title="Connection Failed"
   │   message={errorMessage}
   │   onAction={() => setShowError(false)}
   │ />
   └─────────────────────────────────────────────────────────┘

   SAVINGS: ~23 LOC per app × 40 apps = ~920 LOC

═════════════════════════════════════════════════════════════════════════════════

3. FORM MODAL - Replace custom forms
   ──────────────────────────────────

   BEFORE (Custom implementation - ~40 LOC):
   ┌─────────────────────────────────────────────────────────┐
   │ function SettingsForm({ isOpen, onSave, onCancel }) {
   │   const [name, setName] = useState('')
   │   const [isSaving, setIsSaving] = useState(false)
   │
   │   const handleSubmit = async (e) => {
   │     e.preventDefault()
   │     setIsSaving(true)
   │     try {
   │       await api.saveSettings({ name })
   │       onSave()
   │     } finally {
   │       setIsSaving(false)
   │     }
   │   }
   │
   │   return (
   │     <div className={styles.backdrop} onClick={onCancel}>
   │       <form className={styles.formModal} onSubmit={handleSubmit}>
   │         <h2>Settings</h2>
   │         <label>
   │           Name:
   │           <input value={name} onChange={e => setName(e.target.value)} />
   │         </label>
   │         <div className={styles.actions}>
   │           <button type="button" onClick={onCancel}>Cancel</button>
   │           <button type="submit" disabled={isSaving}>Save</button>
   │         </div>
   │       </form>
   │     </div>
   │   )
   │ }
   └─────────────────────────────────────────────────────────┘

   AFTER (Using FormModal - ~12 LOC):
   ┌─────────────────────────────────────────────────────────┐
   │ import { FormModal } from '@games/ui-utils'
   │
   │ const [name, setName] = useState('')
   │ const [isSaving, setIsSaving] = useState(false)
   │
   │ const handleSubmit = async (e) => {
   │   e.preventDefault()
   │   setIsSaving(true)
   │   try {
   │     await api.saveSettings({ name })
   │     onSave()
   │   } finally {
   │     setIsSaving(false)
   │   }
   │ }
   │
   │ <FormModal
   │   isOpen={isOpen}
   │   title="Settings"
   │   submitLabel="Save"
   │   isSubmitting={isSaving}
   │   onSubmit={handleSubmit}
   │   onCancel={onCancel}
   │ >
   │   <label>
   │     Name:
   │     <input value={name} onChange={e => setName(e.target.value)} />
   │   </label>
   │ </FormModal>
   └─────────────────────────────────────────────────────────┘

   SAVINGS: ~28 LOC per app × 35 apps = ~980 LOC

═════════════════════════════════════════════════════════════════════════════════

PHASE 7 ESTIMATED IMPACT:
  • ConfirmDialog migration: 50 apps × 27 LOC = 1,350 LOC saved
  • AlertDialog migration: 40 apps × 23 LOC = 920 LOC saved
  • FormModal migration: 35 apps × 28 LOC = 980 LOC saved
  ────────────────────────────────────────────────────────
  TOTAL PHASE 7: ~3,250 LOC saved

CUMULATIVE IMPACT (Phases 4-7):
  Phase 4-6: ~850 LOC saved
  Phase 7: ~3,250 LOC saved
  ────────────────────────────────────────────────────────
  TOTAL: ~4,100 LOC saved across all consolidation phases

═════════════════════════════════════════════════════════════════════════════════

NEXT STEPS:

1. Review dialog implementations in 5-10 apps
2. Map them to ConfirmDialog, AlertDialog, or FormModal
3. Create migration checklist for each app
4. Update apps to use new centralized dialogs
5. Run quality validation (lint, format, typecheck)
6. Document final Phase 7 metrics

Manual migration recommended for Phase 7 (unlike Phases 4-6) because
dialog patterns vary significantly by app and may have custom styling
or behavior that needs careful adaptation.

═════════════════════════════════════════════════════════════════════════════════
`)
