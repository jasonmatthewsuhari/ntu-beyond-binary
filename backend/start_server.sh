#!/bin/bash
# Start the Fluent Accessibility Server

cd "$(dirname "$0")/src"
echo "Starting Fluent Accessibility Server..."
python3 server.py
