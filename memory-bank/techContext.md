# Technical Context: iCondo Compiler

## Technology Stack

### Core Technologies

**Language**: TypeScript 5.5+
- Strict mode enabled
- Full type safety
- Modern ES features
- Decorators support

**Package Manager**: pnpm 9.x
- Workspace support
- Fast installs
- Disk space efficiency
- Better dependency resolution

**Build System**: Turbo + rslib
- Incremental builds
- Parallel execution
- Build caching
- Type declaration generation

**Bundlers Supported**:
- Vite 7.1.3 - Fast development with HMR
- Rsbuild 1.5.1 - Rspack-based build tool
- Rspack 1.5.1 - Fast Rust-based bundler

### Development Dependencies

**TypeScript Configuration**:
- `typescript: ^5.5.4`
- `@types/node: ^24.3.0`
- Shared configs in `packages/typescript-config/`

**Linting & Formatting**:
- ESLint with shared configs
- Consistent code style
- Import/export validation

**Testing**:
- Framework agnostic testing strategy
- Unit tests for plugins
- Integration tests for builds

## Development Environment Setup

### Prerequisites
- Node.js 20.19+ or 22.12+
- pnpm 9.x installed globally
- TypeScript knowledge
- Understanding of modern bundlers

### Installation Steps
```bash
# Clone repository
git clone <repo-url>
cd icondo-compiler

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development
pnpm dev
```

### Workspace Structure
```
packages/
├── core/               # @stageit-labs/core
├── vite-config/        # @stageit-labs/vite-config
├── rsbuild-config/     # @stageit-labs/rsbuild-config
├── rspack-config/      # @stageit-labs/rspack-config
├── eslint-config/      # @repo/eslint-config
└── typescript-config/  # @repo/typescript-config

apps/
├── vite-app/          # Vite demo application
├── rsbuild-app/       # Rsbuild demo application
└── rspack-app/        # Rspack demo application
```

## Technical Constraints

### TypeScript Requirements
- Strict mode must be enabled
- No `any` types in public APIs
- Full type coverage for exported functions
- Proper JSDoc documentation

### Module System
- ESM modules only
- "bundler" module resolution
- No CommonJS in new code
- Import/export explicit syntax

### Browser Support
- Modern browsers (ES2022+)
- No legacy polyfills
- Native ESM support assumed
- Modern JavaScript features OK

### Node.js Version Support
- Minimum Node.js 20.19
- Uses modern Node.js APIs
- No deprecated features
- ESM native support

## Package Dependencies

### Core Package Dependencies
```json
{
  "devDependencies": {
    "@rslib/core": "^0.0.5",
    "@types/node": "^24.3.0",
    "typescript": "^5.5.4"
  }
}
```

### Bundler Package Pattern
```json
{
  "dependencies": {
    "@stageit-labs/core": "workspace:*"
  },
  "peerDependencies": {
    "vite": ">=7.0.0",
    "@vitejs/plugin-react": ">=4.0.0"
  },
  "devDependencies": {
    "@rslib/core": "^0.0.5",
    "vite": "^7.1.3",
    "@vitejs/plugin-react": "^4.3.2",
    "@types/node": "^24.3.0",
    "typescript": "^5.5.4"
  }
}
```

### Version Synchronization
All packages maintain consistent versions for:
- TypeScript
- @types/node
- Build tools (rslib)
- Bundler dependencies

## Build Configuration

### rslib Configuration Pattern
```typescript
// rslib.config.ts
import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      dts: true
    }
  ]
})
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Turbo Configuration
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Integration Points

### External Systems
- **VS Code**: TypeScript language server support
- **IDEs**: IntelliSense and autocomplete
- **CI/CD**: Automated builds and testing
- **Package Registries**: npm/pnpm publication

### Bundler Integration
- **Vite**: Native plugin system integration
- **Rsbuild**: Configuration transformation
- **Rspack**: Direct configuration object
- **Future Bundlers**: Extensible plugin architecture

## Performance Considerations

### Build Performance
- Incremental TypeScript compilation
- Turbo build caching
- Parallel package builds
- Selective dependency installation

### Runtime Performance
- Minimal runtime overhead
- Tree-shakeable exports
- No heavy dependencies
- Lazy loading where possible

### Development Performance
- Fast HMR in example apps
- Quick type checking
- Efficient watch mode
- Minimal rebuilds

## Security Considerations

### Dependency Security
- Regular dependency updates
- Automated security scanning
- Minimal dependency surface
- Trusted package sources

### Code Security
- TypeScript type safety
- No eval() or dynamic code
- Secure default configurations
- Input validation in plugins

## Deployment & Distribution

### Package Publishing
- Automated builds via CI
- Version consistency checks
- Type declaration validation
- Example app testing

### Distribution Strategy
- Individual package releases
- Coordinated version bumps
- Backward compatibility
- Migration guides

### Monitoring
- Download statistics
- Usage analytics
- Error reporting
- Community feedback

## Known Technical Debt

### Current Limitations
1. @ts-expect-error suppressions in some files
2. Version conflict management complexity
3. Limited test coverage for edge cases
4. Documentation needs improvement

### Planned Improvements
1. Remove all TypeScript error suppressions
2. Automated version synchronization
3. Comprehensive testing suite
4. Interactive documentation

### Migration Paths
- Gradual TypeScript strictness increases
- Automated refactoring tools
- Deprecation warnings for old patterns
- Clear upgrade paths
