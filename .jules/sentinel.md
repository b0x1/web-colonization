## 2025-05-15 - Input Validation and Length Limits
**Vulnerability:** Missing input length limits on user-provided strings (Player Name) could lead to UI breakage or minor DoS.
**Learning:** Enforcing limits at both the UI layer (maxLength) and the System layer (trim/slice) provides defense-in-depth and ensures data integrity regardless of the entry point.
**Prevention:** Always apply length constraints and sanitization to user-controlled inputs that are persisted or rendered globally.
