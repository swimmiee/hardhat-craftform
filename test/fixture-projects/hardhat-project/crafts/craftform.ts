import { CraftType, CraftDeployProps, GetContractProps } from "../../../../src/core"
import { Test1, Test2 } from '../typechain';
import { Test1Args, Test1Config } from './Test1.config';
import { Test2Args, Test2Config } from './Test2.config';

export type Test1Craft = CraftType<Test1, Test1Config>
export type Test2Craft = CraftType<Test2, Test2Config>

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
            contract: 'Test1',
            props:CraftDeployProps<Test1Config, Test1Args>
        ): Promise<void>
        deploy(
            contract: 'Test2',
            props:CraftDeployProps<Test2Config, Test2Args>
        ): Promise<void>
    }
}