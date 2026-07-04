#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT_DIR/distribution/apple-distribution.json"
EXPORT_OPTIONS="$ROOT_DIR/distribution/ExportOptions.testflight.plist"
WRAPPER="$ROOT_DIR/scripts/apple-distribution-kit.sh"
CAPACITOR_CONFIG="$ROOT_DIR/web/capacitor.config.ts"
XCODE_PROJECT="$ROOT_DIR/ios/App/App.xcodeproj/project.pbxproj"

fail() {
  printf 'apple distribution kit check failed: %s\n' "$1" >&2
  exit 1
}

[[ -x "$WRAPPER" ]] || fail "missing executable wrapper: scripts/apple-distribution-kit.sh"
[[ -f "$MANIFEST" ]] || fail "missing manifest: distribution/apple-distribution.json"
[[ -f "$EXPORT_OPTIONS" ]] || fail "missing TestFlight export options: distribution/ExportOptions.testflight.plist"
[[ -f "$CAPACITOR_CONFIG" ]] || fail "missing Capacitor config"
[[ -f "$XCODE_PROJECT" ]] || fail "missing Xcode project"

secret_file="$(
  find "$ROOT_DIR" \
    -path "$ROOT_DIR/.git" -prune -o \
    -path "$ROOT_DIR/.ci" -prune -o \
    -path "$ROOT_DIR/node_modules" -prune -o \
    -path "$ROOT_DIR/api/node_modules" -prune -o \
    -path "$ROOT_DIR/web/node_modules" -prune -o \
    -path "$ROOT_DIR/.redwood" -prune -o \
    -path "$ROOT_DIR/web/dist" -prune -o \
    -type f \( \
      -name '*.p8' -o \
      -name '*.p12' -o \
      -name '*.mobileprovision' -o \
      -name '*.provisionprofile' -o \
      -name '*.cer' -o \
      -name 'AuthKey_*.p8' \
    \) -print -quit
)"
[[ -z "$secret_file" ]] || fail "secret-looking Apple credential file committed: ${secret_file#$ROOT_DIR/}"

cap_bundle_id="$(
  sed -n "s/^[[:space:]]*appId:[[:space:]]*'\\([^']*\\)'.*/\\1/p" "$CAPACITOR_CONFIG" | head -n 1
)"
cap_app_name="$(
  sed -n "s/^[[:space:]]*appName:[[:space:]]*'\\([^']*\\)'.*/\\1/p" "$CAPACITOR_CONFIG" | head -n 1
)"
xcode_bundle_id="$(
  sed -n 's/^[[:space:]]*PRODUCT_BUNDLE_IDENTIFIER = \([^;]*\);[[:space:]]*$/\1/p' "$XCODE_PROJECT" | sort -u
)"
xcode_marketing_version="$(
  sed -n 's/^[[:space:]]*MARKETING_VERSION = \([^;]*\);[[:space:]]*$/\1/p' "$XCODE_PROJECT" | sort -u
)"

[[ "$cap_bundle_id" == "app.spoonjoy" ]] || fail "Capacitor appId must be app.spoonjoy"
[[ "$xcode_bundle_id" == "app.spoonjoy" ]] || fail "Xcode PRODUCT_BUNDLE_IDENTIFIER must resolve to app.spoonjoy"
[[ -n "$xcode_marketing_version" ]] || fail "missing MARKETING_VERSION"

node - "$MANIFEST" "$cap_bundle_id" "$cap_app_name" "$xcode_marketing_version" <<'NODE'
const fs = require("node:fs");

const [manifestPath, expectedBundleId, expectedName, expectedVersion] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function fail(message) {
  console.error(`manifest contract failed: ${message}`);
  process.exit(1);
}

if (manifest.app?.name !== expectedName) fail(`app.name must be ${expectedName}`);
if (manifest.app?.bundleId !== expectedBundleId) fail(`app.bundleId must be ${expectedBundleId}`);
if (manifest.app?.sku !== "app-spoonjoy-ios") fail("app.sku must be app-spoonjoy-ios");
if (manifest.team?.teamId !== "743GT2AJ24") fail("team.teamId must be 743GT2AJ24");
if (manifest.team?.providerPublicId !== "9735080289") fail("team.providerPublicId must be 9735080289");

const channels = new Map((manifest.channels ?? []).map((channel) => [channel.id, channel]));
const testflight = channels.get("ios-testflight");
if (!testflight) fail("missing ios-testflight channel");
if (testflight.platform !== "ios") fail("ios-testflight platform must be ios");
if (testflight.distribution !== "testflight") fail("ios-testflight distribution must be testflight");
if (testflight.bundleId !== expectedBundleId) fail(`ios-testflight bundleId must be ${expectedBundleId}`);
if (testflight.store?.version !== expectedVersion) fail(`testflight store.version must be ${expectedVersion}`);
if (!testflight.packageCommand?.includes("ExportOptions.testflight.plist")) {
  fail("ios-testflight packageCommand must export an IPA with distribution/ExportOptions.testflight.plist");
}
if (!testflight.packageCommand?.includes("build/apple/testflight/App.ipa") || !testflight.packageCommand?.includes("build/apple/testflight/Spoonjoy.ipa")) {
  fail("ios-testflight packageCommand must normalize Xcode's App.ipa export to build/apple/testflight/Spoonjoy.ipa");
}
if (!Array.isArray(testflight.testflight?.groups) || testflight.testflight.groups.length < 1) {
  fail("ios-testflight must declare at least one TestFlight group");
}
if (!testflight.testflight?.groups?.some((group) => group.name === "Spoonjoy Internal" && group.type === "internal")) {
  fail("ios-testflight must declare the Spoonjoy Internal group");
}
if (!testflight.testflight?.build?.whatsNew) fail("ios-testflight must declare testflight.build.whatsNew");
if (!testflight.testflight?.betaApp?.feedbackEmail) fail("ios-testflight must declare betaApp.feedbackEmail");

console.log("Spoonjoy apple distribution manifest contract ok");
NODE

"$WRAPPER" manifest validate --manifest "$MANIFEST" >/dev/null
"$WRAPPER" plan --manifest "$MANIFEST" --mode dry-run --json >/dev/null
kit_help="$("$WRAPPER" --help)"
grep -q "testflight plan" <<<"$kit_help" || fail "apple-distribution-kit must support testflight plan; update/build the shared kit first"
grep -q "asc get" <<<"$kit_help" || fail "apple-distribution-kit must support asc get; update/build the shared kit first"
"$WRAPPER" testflight plan --manifest "$MANIFEST" --channel ios-testflight --json >/dev/null

printf 'apple distribution kit check ok\n'
