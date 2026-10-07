#!/bin/zsh
# Captures website and App Store screenshots from an app's screenshot mode
# (a Debug-only -ScreenshotMode launch argument with fake data) on an
# iOS Simulator, in light and dark.
#
# Usage:  scripts/capture-screenshots.sh <app> <simulator UDID> [output dir]
#   app:  borderstamp | blueprint
#   Find a UDID with `xcrun simctl list devices`.
#
# The Simulator must already be booted. Booting is deliberately left to you:
# a device's first boot is very heavy on an 8 GB Mac, so reuse warmed-up ones.
#
# Environment overrides:
#   APPS_DIR  where the app repos live (default ~/Developer/Repos/Projects/Apps)
#   SETTLE    seconds to wait after each launch before capturing (default 20)
#   LOOKS     appearances to capture (default "light dark")
#
# Home Screen widget shots aren't automated: quitting the app returns the Home
# Screen to the page with its icon, and simctl can't swipe. Arrange the
# widgets, swipe to their page, then capture with `xcrun simctl io <UDID>
# screenshot` (after `simctl ui <UDID> appearance light|dark`).
set -u

APP=${1:?"usage: $0 <app> <simulator UDID> [output dir]"}
UDID=${2:?"usage: $0 <app> <simulator UDID> [output dir]"}
OUT=${3:-${TMPDIR:-/tmp}/screenshots/$APP}
APPS_DIR=${APPS_DIR:-$HOME/Developer/Repos/Projects/Apps}
SETTLE=${SETTLE:-20}
LOOKS=(${=LOOKS:-light dark})

# Each preset: the Xcode project, scheme, bundle ID, and the shots to take,
# as "file-name|extra launch arguments".
case $APP in
  borderstamp)
    PROJECT="$APPS_DIR/Border Apps/Borderstamp/Borderstamp.xcodeproj"
    SCHEME=Borderstamp
    BUNDLE_ID=com.borderstamp.2026.Borderstamp
    SHOTS=(
      "stamps|"
      "map-countries|-ScreenshotTab map"
      "map-china|-ScreenshotTab map -ScreenshotMapPack chinese-provinces"
    ) ;;
  blueprint)
    PROJECT="$APPS_DIR/Blueprint/Blueprint.xcodeproj"
    SCHEME=Blueprint
    BUNDLE_ID=com.xerodonia.Blueprint
    SHOTS=(
      "today|-ScreenshotScroll today"
      "upcoming|-ScreenshotScroll upcoming"
    ) ;;
  *)
    echo "Unknown app '$APP'. Add a preset to $0." >&2; exit 1 ;;
esac

if ! xcrun simctl list devices | grep "$UDID" | grep -q Booted; then
  echo "Simulator $UDID isn't booted. Boot a warmed-up one first (xcrun simctl boot $UDID)." >&2
  exit 1
fi

echo "Building $SCHEME (Debug) for $UDID…"
xcodebuild -project "$PROJECT" -scheme "$SCHEME" -destination "id=$UDID" -configuration Debug build -quiet || exit 1
SETTINGS=$(xcodebuild -project "$PROJECT" -scheme "$SCHEME" -destination "id=$UDID" -configuration Debug -showBuildSettings 2>/dev/null)
BUILD_DIR=$(echo "$SETTINGS" | awk -F' = ' '/^ *TARGET_BUILD_DIR = /{print $2; exit}')
WRAPPER=$(echo "$SETTINGS" | awk -F' = ' '/^ *WRAPPER_NAME = /{print $2; exit}')
xcrun simctl install "$UDID" "$BUILD_DIR/$WRAPPER" || exit 1

# A plain time keeps the status bar consistent with today's date elsewhere on
# screen (an ISO date needs fractional seconds and ignores the year).
xcrun simctl status_bar "$UDID" override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3

mkdir -p "$OUT"
for look in $LOOKS; do
  xcrun simctl ui "$UDID" appearance "$look"
  for shot in $SHOTS; do
    name=${shot%%|*}; args=(${=shot#*|})
    xcrun simctl terminate "$UDID" "$BUNDLE_ID" 2>/dev/null
    xcrun simctl launch "$UDID" "$BUNDLE_ID" -ScreenshotMode $args >/dev/null || exit 1
    sleep "$SETTLE"
    xcrun simctl io "$UDID" screenshot "$OUT/$name-$look.png" >/dev/null 2>&1 && echo "captured $OUT/$name-$look.png"
  done
done
xcrun simctl terminate "$UDID" "$BUNDLE_ID" 2>/dev/null
xcrun simctl ui "$UDID" appearance light
echo "Done. Review every shot before using it: a busy Mac can capture a half-drawn screen."
