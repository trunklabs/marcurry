# @marcurry/core

## 0.1.0

### Minor Changes

- f2a3dc1: Environment validation is here

  You can now validate environments the same way you validate flags. We've also unified key validation across the board—flags and environments now share the same rules, so you get consistent error messages everywhere.

  **New exports:**
  - `validateEnvironment` – validate environment objects before saving
  - `validateKey` and `KEY_REGEX` – reusable key validation for your own use cases

  This is a non-breaking change. If you're already using flag validation, everything works as before.

- 10d6196: Project and environment validation

  ### Core

  New validators and error classes for projects and environments:
  - **`validateProject()`** — Validates project name (required, max 200 characters)
  - **`ProjectValidationError`** — Thrown when project validation fails
  - **`ProjectMustHaveEnvironmentError`** — Thrown when creating a project without environments
  - **`CannotDeleteLastEnvironmentError`** — Thrown when attempting to delete the last environment in a project

  ### Web

  Projects now require at least one environment at creation time. This rule is enforced at the service layer, ensuring data integrity regardless of how the API is called.
  - Creating a project without environments will now fail with a clear error message
  - Attempting to delete the last environment in a project returns a descriptive error
  - Project names are validated before saving
