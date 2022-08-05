# Hardhat-Craftform

For consistent smart constract deploy environment

## Installation
```bash
npm install hardhat-craftform
```

## Quick Start
You should add some compilerOptions in tsconfig.json

tsconfig.json
```json
"compilerOptions": {
    ...
    "experimentalDecorators": true,
    "strictPropertyInitialization": false
}
```
Then, import hardhat-craftform at `hardhat.config.ts`
```typescript
import "hardhat-craftform"
```
```
npx hardhat compile
```

