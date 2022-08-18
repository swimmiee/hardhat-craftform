# Hardhat-Craftform

For consistent smart constract deploy environment

## Installation
```bash
npm install hardhat-craftform
```

## Quick Start
1. You should add some compilerOptions in tsconfig.json  
tsconfig.json
```json
"compilerOptions": {
    // ...
    "experimentalDecorators": true,
    "strictPropertyInitialization": false
}
```
2. import hardhat-craftform at `hardhat.config.ts`
```typescript
import "hardhat-craftform"
```
3. then, use `useCraftform()` function at the top of your scripts. (not in `hardhat.config.ts`)
```typescript
import { useCraftform } from "hardhat-craftform" 
useCraftform()
```
4. if you compile your solidity files, Contract Crafts will be auto-generated.
```
npx hardhat compile
```
4-1. Or you can manually generate crafts with:
```
npx hardhat craftform
```

## Deploy Contract
```typescript
import { craftform, ethers } from "hardhat"
import { useCraftform } from "hardhat-craftform" 

async function deployMyContract(){
    await useCraftform();

    const [ owner ] = await ethers.getSigners();
    const myCraft = await craftform
        .contract("MyContract")
        .deploy(
            "MyContractAlias",   // if set null, alias will be set as contract name.(in this case, "MyContract")
            // deploy options, typescript fully supported.
            {
                from: owner.address,
                args: ["Hello, World!", 41]
            },
            
            // your custom config for contract
            // you should set config props at {root}/crafts/contract/../your-contract.config.ts
            {
                message: "Hello, World!",
                magicNumber: 41
            }
        )
}
```

## Reuse deployed contract with saved configs
```typescript
import { craftform, ethers } from "hardhat"
import { useCraftform } from "hardhat-craftform" 

async function deployMyContract(){
    await useCraftform();

    const [ owner ] = await ethers.getSigners();
    const myCraft = await craftform..contract("MyContract").attach("MyContractAlias");
    console.log(myCraft.$config.message)    // Hello, World!
    console.log(myCraft.$config.magicNumber)    // 41
}
```


There are 3 ways to attach deployed contracts.
```typescript
// default attach : alias will be set as contract name
const myCraft1 = await craftform..contract("MyContract").attach();

// aliased attach
const myCraft2 = await craftform..contract("MyContract").attach("MyContractAlias");

// address attach
const myCraft3 = await craftform..contract("MyContract").attach("0x0123456789abcdef...");
```