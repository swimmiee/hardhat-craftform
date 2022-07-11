import { CraftType, CraftDeployOptions, GetContractProps } from 'hardhat-craftform/dist/core'
import { Test1, Test2 } from '../typechain';
import { Test1Args, Test1Config } from './Test1.craft';
import { Test2Args, Test2Config } from './Test2.craft';

declare module "hardhat/types/runtime" {
    interface CraftformHelper {
                get(
            contractName: 'Test1',
            props: GetContractProps
        ): Promise<CraftType<Test1, Test1Config>>
        get(
            contractName: 'Test2',
            props: GetContractProps
        ): Promise<CraftType<Test2, Test2Config>>

                deploy(
            contractName: 'Test1',
            options: CraftDeployOptions<Test1Args>
        ): Promise<void>
        deploy(
            contractName: 'Test2',
            options: CraftDeployOptions<Test2Args>
        ): Promise<void>
    }
}
