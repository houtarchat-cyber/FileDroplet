#!/bin/bash

# Exit immediately if a command exits with a non-zero status
cleanup() {
    echo "Caught signal, cleaning up..."
    # Uninstall cloudflared service
    if cloudflared service uninstall; then
        echo "Cloudflared service uninstalled successfully."
    else
        echo "Failed to uninstall cloudflared service."
    fi
    # Kill the child process
    if [ -n "$!" ]; then
        kill -s SIGTERM $! || true
    fi
    # Exit the script
    exit 0
}

# Trap the SIGINT and SIGTERM signals and call the cleanup function
trap cleanup SIGINT SIGTERM

# Install cloudflared service
cloudflared service install $TUNNEL_TOKEN &
python -m app

# After the process is killed, call the cleanup function
cleanup