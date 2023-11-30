#!/bin/bash
# Navigate to the android directory
cd "$(dirname "$0")/android"
# Extract the application ID
APP_ID=$(grep "applicationId" app/build.gradle | awk '{print $2}' | tr -d '"')
# Start the app using adb
adb shell am start -n "$APP_ID/.MainActivity"