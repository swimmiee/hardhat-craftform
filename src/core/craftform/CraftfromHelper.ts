import { ethers } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { BaseConfig } from "./BaseConfig";
import { CraftFactory } from "./CraftFactory";
import { CraftformGlobal, ICraftformHelper } from "../../CraftformHelper";
import { Artifacts, Network } from "hardhat/types";
import { DeployArgsBase } from "../types";
import { BaseCraft } from "./BaseCraft";

export class CraftformHelper implements ICraftformHelper {
    public artifacts: Artifacts
    public network: Network
    // from @nomiclabs/hardhat-ethers
    public ethers: typeof ethers
    // from hardhat-deploy
    public deployments: DeploymentsExtension;

    /**
     * @deprecated
     */
    public _global:CraftformGlobal = {
        relations: {},
        configs: []
    };

    constructor(
        _artifacts: Artifacts,
        _network: Network,
        _ethers: typeof ethers,
        _deployments: DeploymentsExtension,
    ) { 
        this.artifacts = _artifacts;
        this.network = _network;
        this.ethers = _ethers;
        this.deployments = _deployments;
    }
    
    public contract<
        Config extends BaseConfig,
        Craft extends BaseCraft<Config>,
        DeployArgs extends DeployArgsBase
    >(contract: string): CraftFactory<Config, Craft, DeployArgs> {
        const config = this._global.configs.find(c => c.contract === contract)
        if(!config)
            throw Error(`CraftformHelper:: config ${contract} not found.\n'\033[31m'[36m Please check again if you imported the crafts folder.'\033[0m'`)
        const relations = this._global.relations[contract]
        return new CraftFactory(this, config, relations || [])
    }
}