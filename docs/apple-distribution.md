# Apple Distribution

Spoonjoy uses the shared `ourostack/apple-distribution-kit` contract for Apple
distribution planning. The app-specific manifest is
`distribution/apple-distribution.json`; it is intentionally app-neutral and uses
the Spoonjoy bundle family `app.spoonjoy`, not any Ouro bundle identifier or
environment naming.

Current scope:

- iOS/TestFlight internal beta publishing through `ourostack/apple-distribution-kit`.
- No production App Store submission from this branch.
- No Apple credentials in source.

Validate the contract with:

```bash
scripts/check-apple-distribution-kit.sh
```

The check compares the manifest against `web/capacitor.config.ts` and the iOS
Xcode project, validates it with `apple-distribution-kit`, emits dry-run
distribution and TestFlight plans, and rejects committed Apple credential files.

## TestFlight Handoff

The manifest declares the canonical Apple provider (`9735080289`) and the first
beta group, `Spoonjoy Internal`. The packaging command archives the iOS app and
exports an IPA under `build/apple/testflight/` using
`distribution/ExportOptions.testflight.plist`.

Suggested release flow for the publishing agent:

Prerequisite: `scripts/apple-distribution-kit.sh --help` must show
`testflight plan`, `testflight publish`, and `asc get`. If it does not, update
or build the shared `ourostack/apple-distribution-kit` checkout first.

```bash
scripts/check-apple-distribution-kit.sh

scripts/apple-distribution-kit.sh testflight plan \
  --manifest distribution/apple-distribution.json \
  --channel ios-testflight \
  --json

yarn rw build web && yarn cap sync

mkdir -p build/apple && \
  xcodebuild -workspace ios/App/App.xcworkspace \
    -scheme App \
    -configuration Release \
    -archivePath build/apple/Spoonjoy.xcarchive \
    archive \
    -allowProvisioningUpdates && \
  xcodebuild -exportArchive \
    -archivePath build/apple/Spoonjoy.xcarchive \
    -exportPath build/apple/testflight \
    -exportOptionsPlist distribution/ExportOptions.testflight.plist \
    -allowProvisioningUpdates && \
  test -f build/apple/testflight/App.ipa && \
  mv -f build/apple/testflight/App.ipa build/apple/testflight/Spoonjoy.ipa

eval "$(jq -r '
  "APP_STORE_CONNECT_KEY_ID=\(.keyId|@sh)\n" +
  "APP_STORE_CONNECT_ISSUER_ID=\(.issuerId|@sh)\n" +
  "APP_STORE_CONNECT_KEY_PATH=\(.privateKeyPath|@sh)"
' "$HOME/Library/Application Support/AppleDistributionKit/app-store-connect/config.json")"

scripts/apple-distribution-kit.sh xcode run \
  --kind altool-upload \
  --mode apply \
  --package-path build/apple/testflight/Spoonjoy.ipa \
  --platform ios \
  --api-key "$APP_STORE_CONNECT_KEY_ID" \
  --api-issuer "$APP_STORE_CONNECT_ISSUER_ID" \
  --p8-file-path "$APP_STORE_CONNECT_KEY_PATH" \
  --provider-public-id 9735080289 \
  --json
```

After App Store Connect shows the uploaded build as `VALID`, use the returned or
queried App Store Connect IDs to publish it to the internal group:

```bash
scripts/apple-distribution-kit.sh asc get \
  --path /v1/apps \
  --query 'filter[bundleId]=app.spoonjoy' \
  --query 'limit=1' \
  --json

scripts/apple-distribution-kit.sh asc get \
  --path /v1/builds \
  --query "filter[app]=$ASC_APP_ID" \
  --query 'filter[preReleaseVersion.platform]=IOS' \
  --query 'filter[processingState]=VALID' \
  --query 'sort=-uploadedDate' \
  --query 'include=buildBetaDetail' \
  --json

scripts/apple-distribution-kit.sh asc get \
  --path "/v1/apps/$ASC_APP_ID/betaGroups" \
  --json

scripts/apple-distribution-kit.sh testflight publish \
  --mode dry-run \
  --manifest distribution/apple-distribution.json \
  --channel ios-testflight \
  --app-id "$ASC_APP_ID" \
  --build-id "$ASC_BUILD_ID" \
  --build-beta-detail-id "$ASC_BUILD_BETA_DETAIL_ID" \
  --group-id "Spoonjoy Internal=$ASC_INTERNAL_GROUP_ID" \
  --artifact artifacts/apple/testflight-publish-plan.json \
  --json

scripts/apple-distribution-kit.sh testflight publish \
  --mode apply \
  --manifest distribution/apple-distribution.json \
  --channel ios-testflight \
  --app-id "$ASC_APP_ID" \
  --build-id "$ASC_BUILD_ID" \
  --build-beta-detail-id "$ASC_BUILD_BETA_DETAIL_ID" \
  --group-id "Spoonjoy Internal=$ASC_INTERNAL_GROUP_ID" \
  --json
```

External TestFlight is supported by the shared kit, but it intentionally is not
the default Spoonjoy path because beta-review contact/demo-account metadata
belongs in a release decision, not in this bootstrap manifest.
