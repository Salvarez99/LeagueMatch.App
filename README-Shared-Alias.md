**Shared Types Alias**

- **Purpose**: Allow both the `Client` (Expo/React Native) and `Server/functions` (Firebase Functions) projects to import shared TypeScript types and modules from the root `Shared` folder using the `@Shared` alias.

**How to import**

- Import a type directly:

```ts
import type { IUser } from "@Shared/types/IUser";
```

- Use the `Shared` barrel (`Shared/index.ts`) to import multiple types:

```ts
import type { ILobby, ILobbyPlayer, IUser } from "@Shared";
```

- Import runtime exports (if you add them later):

```ts
import { someValue } from "@Shared/someModule";
```

**Files changed**

- `Client/tsconfig.json` — added `../Shared/**/*.ts`, `../Shared/**/*.tsx`, and `../Shared/**/*.d.ts` to `include` so the client TypeScript project sees shared types.
- `Client/metro.config.js` — mapped `@Shared` to `../Shared` and added `watchFolders` so Metro resolver and watcher handle files outside the `Client` folder.
- `Server/functions/tsconfig.json` — added `../../Shared/**/*.ts` and adjusted `rootDir`/compiler options (`target`, `allowJs`, `skipLibCheck`, `moduleResolution`) so the functions TypeScript build can include and type-check shared files.
- `Server/functions/src/firebaseConfig.d.ts` — small ambient type file to provide typing for the existing JS `firebaseConfig.js` module.

**Verify locally**

- Server build (functions):

```bash
cd "c:/Users/steph/Documents/Code/Projects/Node-JS/LeagueMatch.App/Server/functions"
npm run build
```

- Client type-check (no emit):

```bash
cd "c:/Users/steph/Documents/Code/Projects/Node-JS/LeagueMatch.App/Client"
npx tsc --noEmit --project tsconfig.json
```

- Start Metro (resolves `@Shared`):

```bash
cd "c:/Users/steph/Documents/Code/Projects/Node-JS/LeagueMatch.App/Client"
npm start
```

**Troubleshooting**

- If VS Code doesn't resolve imports, restart the TypeScript server: open the command palette and run `TypeScript: Restart TS Server`, or reload the window.
- Metro bundler may cache resolution issues. If imports fail at runtime, try:

```bash
expo start -c
# or
npx react-native start --reset-cache
```

- If `tsc` reports that a file is not under `rootDir` (TS6059), it means `rootDir` doesn't cover the `Shared` path. The `functions/tsconfig.json` was adjusted to include the repo root; if you'd prefer not to compile `Shared` into `functions/lib`, consider one of the alternatives below.

**Alternatives (cleaner long-term)**

- Convert `Shared` to a separate TypeScript project and use Project References. This avoids changing `rootDir` for `functions` and allows building `Shared` separately.
- Publish `Shared` as a private/local npm package and add it as a dependency in `Client` and `functions`.
- Add a build-time copy/link step to copy only the needed shared files into `functions/src` before compiling.

**Notes & Caveats**

- I set `skipLibCheck` and `allowJs` in `Server/functions/tsconfig.json` to work around some 3rd-party types and existing JS modules. This is pragmatic but relaxes some type-checking — we can make it stricter later.
- The alias setup is in place; running the verification commands will show any remaining code-level TypeScript errors (these are unrelated to alias resolution and are real type mismatches/typos in the codebase).

If you want, I can:

- Fix the small server-side issues (typo `fromFireStore` → `fromFirestore`, constructor signature mismatch) and re-run the build.
- Start fixing client type errors.
- Convert `Shared` to a project reference setup for a cleaner build separation.

Tell me which option you'd like and I'll proceed.
