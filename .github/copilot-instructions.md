# TrueBlocks Ballad - AI Development Instructions

## Project Architecture

This is a **Wails desktop application** with Go backend (`app/`) and React frontend (`frontend/src/`). The app interfaces with TrueBlocks Core SDK for blockchain data analysis and uses auto-generated TypeScript bindings from Go models.

### Core Components
- **Backend**: Go app in `app/` with API handlers (`api_*.go`) exposing TrueBlocks functionality
- **Frontend**: React/TypeScript with Mantine UI, organized by Views (`views/`) with Facets pattern
- **Models**: Auto-generated TypeScript types in `frontend/wailsjs/go/models.ts` from Go structs
- **Data Flow**: Frontend → Wails bindings → Go backend → TrueBlocks Core SDK

## ABSOLUTE REQUIREMENTS - ZERO TOLERANCE

### Package Management
- **YARN ONLY** - Never use `npm` or `npx`
- Run commands from repo root: `yarn start`, `yarn build`, `yarn test`
- Frontend commands run through root package.json, not `frontend/` directory

### Development Workflow
- **Always use `yarn start`** (Wails dev mode) - never browser mode or localhost:5173
- **Use `Log` from `@utils`** instead of console.log (console.log is invisible in Wails)
- **Read file contents first** before editing - files change between requests
- **No comments in production code** - only use comments for TODOs or explanations
- **Use `wails generate module`** to regenerate bindings after changes to the backend go code.
- **Always run the linter** from the root of the project with `yarn lint`.
- **Run linting, testing, and building** together with one command `yarn lint && yarn test && yarn start`. If any fail, stop and do not try to fix it. The developer will fix and provide guidance.

### Code Patterns
- **Use existing patterns**: BaseTab, Table components, DataFacet enums, Collection/Store/Page architecture
- **Follow established architecture**: Import from `@models`, `@components`, `@utils`, `@hooks`
- **No React imports** (implicitly available)
- **No comments** in production code
- **Do not use `any` in TypeScript** - always use specific types (our linter won't allow it)
- **No custom strings for DataFacet** - always use `types.DataFacet.*` values
- **No custom ViewStateKey** - always use `{ viewName: string, tabName: types.DataFacet }`

## View Architecture Pattern

Each view follows this structure:
```
views/[viewname]/
├── [ViewName].tsx     # Main component with sections: Imports, Hooks, Handlers, Render
├── facets.ts          # DataFacet configurations and routing
├── columns.ts         # Table column definitions per facet
└── index.ts           # Exports
```

### Key Patterns
- **DataFacet enum**: Use `types.DataFacet.*` values, never custom strings
- **ViewStateKey**: `{ viewName: string, tabName: types.DataFacet }`
- **Page Data**: Auto-generated types like `monitors.MonitorsPage` with `facet`, `data[]`, `state`
- **BaseTab component**: Handles tables with `data`, `columns`, `viewStateKey`, `loading`, `error`

## Backend Integration

### API Endpoints
- Backend functions in `app/api_*.go` are auto-bound to frontend as `@app` imports
- Page data fetched via functions like `GetMonitorsPage(payload)`
- CRUD operations via `*Crud(action, data)` functions
- Error handling through `types.LoadState` enum

### Auto-Generated Models
- TypeScript types generated from Go structs in `frontend/wailsjs/go/models.ts`
- Import namespaced: `{ monitors, types, msgs } from '@models'`
- Never duplicate these types - always use generated ones

## Development Commands

```bash
# Development (from root)
yarn start              # Wails dev mode (NOT yarn dev)
yarn build             # Production build
yarn test              # Run all tests (Go + TypeScript + Dalle)
yarn lint              # Lint Go and TypeScript

# Testing specific components
yarn test-go           # Go backend tests
yarn test-tsx          # Frontend tests
yarn test-tsx <filename> # Run a single frontend test file
yarn test-dalle        # Dalle module tests
```

## Component Usage

### Tables
```tsx
import { BaseTab } from '@components';
import { getColumns } from './columns';

<BaseTab
  data={pageData?.monitors || []}
  columns={getColumns(getCurrentDataFacet())}
  viewStateKey={viewStateKey}
  loading={pageData?.isFetching || false}
  error={error}
  onSubmit={handleSubmit}
  onDelete={handleDelete}
/>
```

### Hooks
- `useActiveFacet()`: Manages view facets and routing
- `usePayload()`: Creates API request payloads
- `useActions()`: CRUD operations with error handling
- `useFiltering()`, `useSorting()`, `usePagination()`: Table state management

### Logging
```tsx
import { Log } from '@utils';
Log('Debug message here'); // Single string parameter only
```

### Address Handling
- **NEVER use manual address conversion** - use standardized utilities from `@utils`
- **Frontend ↔ Backend consistency**: Mirror Go patterns with TypeScript equivalents
- **Standard conversions**:
  ```tsx
  import { addressToHex, hexToAddress, getDisplayAddress, isValidAddress } from '@utils';
  
  // Convert address to hex string (equivalent to Go's addr.Hex())
  const hexString = addressToHex(address);
  
  // Convert hex string to address object (equivalent to Go's base.HexToAddress())
  const addressObj = hexToAddress('0x1234...');
  
  // Display truncated address (0x1234...abcd)
  const display = getDisplayAddress(address);
  
  // Validate non-zero address
  const valid = isValidAddress(address);
  ```
- **Forbidden patterns**:
  - `String(contract.address)` ❌
  - Manual byte array conversion ❌ 
  - `address as string` casting ❌
  - Custom address formatting functions ❌
  - Legacy function names `getAddressString`, `stringToAddress` ❌

## Error Handling Protocol

### Stop Conditions
- **Test failures**: Stop, report exact error, await instructions
- **Lint errors**: Stop, report issues, await fixes  
- **Build failures**: Stop, provide full output, await guidance
- **Unclear requirements**: Stop, ask specific questions

### Don't Guess
- Ask "Please clarify: [specific question]" instead of assuming
- Be honest about mock vs. real implementations
- Acknowledge when you don't understand something

### Anti-Bloat Principles
- **Use existing utilities** before creating new ones - check `@utils` first
- **Maintain consistency** with established patterns across the codebase
- **Remove redundant code** when standardizing - don't leave both old and new patterns
- **Check for existing solutions** before implementing custom logic
- **Follow the principle**: "If we've solved this problem once, reuse that solution"

## File Structure Context

```
app/                    # Go backend with TrueBlocks integration
├── api_*.go           # API handlers for each data collection
├── app.go             # Main Wails app struct and lifecycle
└── *.go               # Business logic and utilities

frontend/src/
├── components/        # Reusable UI components (BaseTab, Table, etc.)
├── views/            # Main application views with Facets pattern
├── hooks/            # Custom React hooks for data and state
├── contexts/         # React context providers
├── stores/           # Application state management
├── utils/            # Utilities including Log function
└── wailsjs/          # Auto-generated Wails bindings and types

pkg/                   # Go packages for backend functionality
dalle/                 # Separate Go module for AI/image generation
```

## Integration Points

- **TrueBlocks Core**: Backend integrates via SDK for blockchain data
- **Wails Bindings**: Auto-generated TypeScript/Go bridge
- **External APIs**: OpenAI integration in `dalle/` module
- **File System**: Project management and preferences via Go backend

Follow these patterns precisely. When in doubt, examine existing views like `monitors/` or `status/` for reference implementations.

## Wails Architecture

Go backend runs in the same process as the frontend
CGO bridge enables direct JavaScript ↔ Go function calls
Webview (like embedded Chromium) hosts the frontend
No separate processes - everything runs in a single process
Direct memory sharing between JS and Go (with serialization at the boundary) So it's even more impressive than IPC! The calls are:

- Synchronous from JS perspective (though Go functions can be async)
- Direct function invocation across the language boundary
- Minimal overhead compared to network calls or traditional IPC
- Shared memory space with serialization only at the JS/Go boundary
This makes the caching discussion even more interesting because:

- Calls are very fast - Direct CGO bridge, not IPC
- But serialization still exists - JSON-like marshaling between JS objects and Go structs
- Caching is still beneficial - Avoids repeated marshaling overhead
- Cache coherence is still the real problem - Backend transforms data without frontend awareness