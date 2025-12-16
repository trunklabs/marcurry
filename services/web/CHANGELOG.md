# @marcurry/web

## 0.1.0

### Minor Changes

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

- 4299bcb: Feature flag evaluation API & key management

  ## UI

  **API Key Management**

  Create and manage API keys directly from your project's Edit dialog. Each key gives your applications secure access to evaluate feature flags.
  - **Named keys** — Give each key a descriptive name (e.g., "Production Backend", "Staging App")
  - **Environment scoping** — Select which environments each key can access
  - **Key rotation** — Rotate keys anytime with a confirmation step to prevent accidents
  - **Usage tracking** — See when each key was last used
  - **One-time secret** — Secret keys are shown only once at creation, so save them somewhere safe

  ## API

  **Flag Evaluation Endpoint**

  Evaluate feature flags programmatically with `POST /api/v1/flags/evaluate`:

  ```bash
  curl -X POST https://your-app.com/api/v1/flags/evaluate \
    -H "Content-Type: application/json" \
    -H "X-API-Key: mc_your-api-key" \
    -d '{
      "environmentKey": "production",
      "flagKey": "my-feature",
      "actor": { "id": "user-123" }
    }'
  ```

  The response includes the flag's enabled state, resolved value, and evaluation reason — everything you need to make feature decisions in your code.

- c0f0b41: Improved theme switching experience with a new dropdown menu

### Patch Changes

- 1a11207: Streamline project and environment forms

  Description fields have been removed from the UI as they were never persisted to the database. Forms are now streamlined to only show fields that are actually saved.

- 757c7c0: Improve UI elements theme consistency

  Some UI elements were inconsistent with the theming, in this update, we are addressing the issue.

- 7f78184: New Light & Dark Theme Toggle

  We've added a theme switcher so you can choose the look that works best for you.

- f2a3dc1: Better environment validation

  Creating or updating environments now automatically validates your input before saving. Invalid keys or names are caught early with clear error messages, so you'll know exactly what to fix.

- Updated dependencies [f2a3dc1]
- Updated dependencies [10d6196]
  - @marcurry/core@0.1.0
