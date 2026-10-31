# Node 26 compatibility audit

Date: 29 October 2026. Scope: adapt the existing Phase 1 foundation to the Product Owner's Node **26.13.0 / npm 11.6.3** target. This supersedes the earlier Node 22 Option A selection. React + TypeScript + Vite, all application behavior and existing source/tests are retained. Phase 2 is not authorized; the Product Owner handles all Git operations.

## Evidence and proposed changes

Before editing project declarations, the agent reported the compatibility findings and proposed changes in the conversation. Context7 documentation was checked for Vitest, Vite, React Router, Playwright, jsdom, TypeScript, npm, ESLint, Tailwind and React. Exact released metadata was then read with `npm view <name>@<pin> version engines peerDependencies peerDependenciesMeta dependencies dist.integrity --json` from the official npm registry. Exact published manifests take precedence over documentation for newer releases or repository development requirements.

**Smallest dependency change set: zero version changes.** Update only the runtime declarations and their documentation, then resolve/install the existing pins and generate a genuine application lockfile. Published engine acceptance does not alone establish successful execution or a package author's tested platform matrix. Full installation and validation results are recorded in [Phase 1 validation](phase-1-validation.md).

Final outcome: clean installation, aggregate typecheck/lint/unit/build, six browser smoke cases, and additional 360/768/1440 responsive/keyboard checks passed. Application source is unchanged. Two assumptions in the existing smoke assertions were corrected for rendered line breaks and native browser modal focus traversal; all tests remain enabled.

**Lifecycle caveat:** [ESLint 9 is upstream EOL](https://eslint.org/version-support/) and npm emits a deprecation notice for 9.39.5. Its declared Node range still accepts Node 26 and lint passes. Zero upgrades is the minimum for **published engine compatibility**, not a claim that every retained release line receives upstream maintenance. Moving ESLint and `@eslint/js` to major 10 would address maintenance status and is kept separate from this minimal runtime adaptation.

| Direct package | Retained exact pin | Published Node engine | Node 26.13.0 assessment |
|---|---|---|---|
| react | 19.3.1 | `>=0.10.0` | Accepted |
| react-dom | 19.3.1 | None declared | No engine restriction; React peer satisfied |
| react-router | 8.5.1 | `>=22.22.0` | Accepted; React/DOM >=19.2.7 satisfied |
| @eslint/js | 9.39.5 | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0` | Accepted |
| @playwright/test | 1.64.1 | `>=20` | Accepted; current docs explicitly list Node 26 |
| @tailwindcss/postcss | 4.3.3 | None declared | No direct engine restriction; native transitive tooling needs install/build validation |
| @testing-library/dom | 10.4.2 | `>=18` | Accepted |
| @testing-library/react | 16.3.3 | `>=18` | Accepted; DOM/React/type peers satisfied |
| @testing-library/user-event | 14.6.8 | `>=12` | Accepted; npm >=6 satisfied |
| @types/node | 22.20.5 | None declared | Compile-time declarations; Vite/Vitest peers accept this version |
| @types/react | 19.3.0 | None declared | Compile-time declarations; peers satisfied |
| @types/react-dom | 19.3.0 | None declared | Compile-time declarations; React types peer satisfied |
| @vitejs/plugin-react | 6.1.2 | `^20.19.0 \|\| >=22.12.0` | Accepted; Vite ^8 peer satisfied |
| eslint | 9.39.5 | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0` | Accepted |
| eslint-plugin-react-hooks | 7.1.1 | `>=18` | Accepted; ESLint 9 peer satisfied |
| globals | 16.4.0 | `>=18` | Accepted |
| jsdom | 29.1.1 | `^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0` | Accepted; no upgrade to jsdom 30 needed |
| postcss | 8.5.32 | `^10 \|\| ^12 \|\| >=14` | Accepted; Vite/PostCSS plugin ranges satisfied |
| tailwindcss | 4.3.3 | None declared | Retain existing PostCSS integration; validate native dependencies through build |
| typescript | 6.0.3 | `>=14.17` | Accepted; published compiler requirement differs from repository development tools |
| typescript-eslint | 8.72.1 | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0` | Accepted; TypeScript >=4.8.4 <6.1.0 and ESLint 9 peers satisfied |
| vite | 8.3.5 | `^20.19.0 \|\| >=22.12.0` | Accepted; no Vite major upgrade needed |
| vitest | 5.0.5 | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` | Explicitly accepts Node 26; Vite 8 and jsdom peers satisfied |

There are **23 direct dependencies** (3 runtime, 20 development). The selected package manager **npm 11.6.3** separately declares Node `^20.17.0 || >=22.9.0`, which accepts Node 26.13.0.

`@types/node` describes APIs available to TypeScript; its major does not need to match the executing runtime. Keeping 22.20.5 avoids a gratuitous major upgrade and retains a conservative API surface for the existing configuration. It satisfies both Vite's `^20.19.0 || >=22.12.0` and Vitest's `^22.0.0 || >=24.0.0` types peers. Revisit only if the project later uses Node 26-specific APIs.

## Runtime selection and installation

- `engines.node`: `>=26.13.0 <27.0.0`. This deliberately limits the project to the selected Node major with the requested patch floor.
- `.nvmrc`: `26.13.0`. It records a version; it does not switch or install a runtime.
- `packageManager`: `npm@11.6.3`. It records the selected npm version; it does not replace the npm executable on PATH.
- `.npmrc`: retain `save-exact=true` and `engine-strict=true`. No force, peer-conflict or engine bypass is needed.

The actual session has Node 26.13.0 and global npm **11.20.0**, not 11.6.3. The agent downloaded npm 11.6.3 into the ignored local npm execution cache and verified its version. Project installation and checks use that selected runner without changing the global npm installation. Registry socket access fails with EACCES in the sandbox; explicitly approved execution outside the sandbox successfully reached the official registry. This supersedes the earlier session's unavailable-registry finding.

For the Product Owner's PowerShell terminal with npm 11.6.3 already active:

```powershell
Get-Command node,npm -All
node --version  # v26.13.0
npm --version   # 11.6.3
npm config get engine-strict  # true
npm install --registry=https://registry.npmjs.org/
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run test:smoke
```

If PATH exposes another npm, use the exact official temporary runner without a global change:

```powershell
npm exec --yes --package=npm@11.6.3 -- npm --version
npm exec --yes --package=npm@11.6.3 -- npm install --registry=https://registry.npmjs.org/
npm exec --yes --package=npm@11.6.3 -- npm run check
npm exec --yes --package=npm@11.6.3 -- npm run test:smoke
```

After a genuine lockfile exists, `npm ci` verifies a clean reproducible installation. Never recursively follow a dependency junction back into the workspace during cleanup. No source/test deletion is part of this adaptation.

## Primary references

- Exact versions: [Vitest 5.0.5](https://www.npmjs.com/package/vitest/v/5.0.5), [Vite 8.3.5](https://www.npmjs.com/package/vite/v/8.3.5), [React Router 8.5.1](https://www.npmjs.com/package/react-router/v/8.5.1), [Playwright 1.64.1](https://www.npmjs.com/package/@playwright/test/v/1.64.1), [jsdom 29.1.1](https://www.npmjs.com/package/jsdom/v/29.1.1), [TypeScript 6.0.3](https://www.npmjs.com/package/typescript/v/6.0.3), [npm 11.6.3](https://www.npmjs.com/package/npm/v/11.6.3).
- [Vite 8 Node requirements](https://vite.dev/blog/announcing-vite8), [React Router v8 minimum versions](https://reactrouter.com/upgrading/v7), [Playwright system requirements](https://playwright.dev/docs/intro#system-requirements), [ESLint 9 Node support](https://eslint.org/docs/latest/use/migrate-to-9.0.0#drop-old-node), [npm engines configuration](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines).
