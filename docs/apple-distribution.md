# Apple Distribution

Spoonjoy uses the shared `ourostack/apple-distribution-kit` contract for Apple
distribution planning. The app-specific manifest is
`distribution/apple-distribution.json`; it is intentionally app-neutral and uses
the Spoonjoy bundle family `app.spoonjoy`, not any Ouro bundle identifier or
environment naming.

Current scope:

- iOS/TestFlight dry-run planning only.
- No App Store submission or upload from this branch.
- No Apple credentials in source.

Validate the contract with:

```bash
scripts/check-apple-distribution-kit.sh
```

The check compares the manifest against `web/capacitor.config.ts` and the iOS
Xcode project, validates it with `apple-distribution-kit`, emits a dry-run plan,
and rejects committed Apple credential files.
