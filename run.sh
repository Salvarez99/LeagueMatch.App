#!/bin/bash
# Run Firebase emulator in the background, React Native app in the foreground

# Open both projects in VS Code
code ./Server
code ./Client/league-match-app

# # --- Start Firebase emulator in background (fully detached) ---
# echo "🚀 Starting Firebase Emulator (background)..."
# cd ./Server || exit

# # Use 'nohup' to detach it from the current terminal and redirect logs
# nohup firebase emulators:start > ../firebase.log 2>&1 &

# # Capture process ID
# FIREBASE_PID=$!
# echo "📡 Firebase emulator started in background (PID: $FIREBASE_PID)"
# echo "🧾 Logs are being written to firebase.log"

# # Wait a few seconds to ensure Firebase UI starts
# sleep 8
# start "" "http://127.0.0.1:4000/firestore/default/data/default"

# # --- Run React Native app (foreground) ---
# echo "⚡ Starting React Native App (foreground)..."
# cd ../Client/league-match-app || exit
# npm start

# # --- Cleanup when React app stops ---
# echo "🛑 Stopping Firebase emulator..."
# kill $FIREBASE_PID 2>/dev/null
# echo "✅ All processes stopped."
