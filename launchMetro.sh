#!/bin/bash
# Get the directory of this script
DIR="$(dirname "$0")"
# Navigate to the script's directory
cd "$DIR"
# Check if Metro is running on port 8081
if lsof -i :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "Metro is already running."
else
    echo "Starting Metro in a new terminal..."
    # Using open -a Terminal to start a new Terminal window
    open -a Terminal "$(pwd)/startMetro.sh"
fi