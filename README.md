# LeagueMatch.App

LeagueMatch.App is a full-stack mobile application for finding League of Legends teammates and organizing lobby matches. The app combines a React Native / Expo client with a Firebase-backed backend powered by NestJS and Cloud Functions.

## Project structure

- Client: React Native / Expo frontend
- Server/functions: Firebase Cloud Functions and NestJS API
- Packages/shared: shared types and utilities used by the client and server

## Prerequisites

Make sure you have the following installed:

- Node.js 22
- npm
- Expo CLI / Expo Go
- Firebase CLI (for local emulation and deployment)

## Installation

From the repository root, install dependencies for each part of the project:

```bash
cd Packages/shared && npm install
cd ../../Client && npm install
cd ../Server/functions && npm install
```

## Run the application

### Local control panel

The repository includes a small browser-based runtime manager. It starts the shared package watcher, Firebase/Nest emulators, and Expo from one dashboard, while also providing individual start, stop, and restart controls, live logs, and the Expo Go QR code.

From the repository root, install the control-panel dependency once and start it:

```bash
npm install
npm run control
```

Open `http://127.0.0.1:4173` in a browser or the VS Code internal browser. On Windows, you can also double-click `start-control-panel.cmd`.

The default Expo mode is LAN. Your phone and development computer must be on the same network. For the mobile app to reach the local API from a physical phone, set `EXPO_PUBLIC_LOCAL_HOST` to the development computer's LAN IP before starting Expo. The panel also links to the Firebase Emulator UI at `http://127.0.0.1:4000` and API Swagger at `http://127.0.0.1:5001/league-match-app/us-central1/api/docs`.

### 1. Start the backend

From [Server/functions](Server/functions), run:

```bash
npm run serve
```

This builds the TypeScript code and starts the Firebase emulators.

### 2. Start the mobile app

From [Client](Client), run:

```bash
npm start
```

You can then open the Expo app on your phone or run one of the platform-specific commands:

```bash
npm run android
npm run ios
npm run web
```

## Build the backend

To compile the server functions without launching emulators:

```bash
cd Server/functions
npm run build
```

## Notes

- The client expects the backend to be available when you run the app.
- If you are using Firebase features locally, make sure the emulator environment is configured correctly.
- For deployment, use the Firebase CLI from the server functions directory.
