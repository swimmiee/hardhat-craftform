import { ConfigMetadata, RelationMetadata } from "../metadata";
import { BaseConfig } from "./BaseConfig";
import { CraftformHelper } from "./CraftfromHelper";
import { _addConfig, _getConfig, _updateConfig } from "./config";
import { CraftDeployOptions, CraftDeployConfig, NewConfigProps, Versioning, DeployArgsBase, ConfigVersion } from "../types";
import { extractContractNameFromConfigName } from "../decorators/extractContractFromConfig";
import { BaseCraft } from "./BaseCraft";
import chalk from "chalk";
import { _removeConfig } from "./config/removeConfig";


export class CraftFactory<
    Config extends BaseConfig,
    Craft extends BaseCraft<Config>,
    // Craft extends CraftType<Contract, Config>,
    DeployArgs extends DeployArgsBase
> {
    private global: CraftformHelper
    private config: ConfigMetadata
    private relations: RelationMetadata[]

    constructor(
        _global: CraftformHelper,
        _config: ConfigMetadata,
        _relations: RelationMetadata[],
    ){
        this.global = _global;
        this.config = _config;
        this.relations = _relations;
    }

    private contractName(){
        return this.config.contract
    }

    private chain(){
        return this.global.network.name
    }


    async attach(
        aliasOrAddress?: string | null, 
        version: ConfigVersion = "latest",
    ):Promise<Craft>{
        const contract = this.contractName()
        const chain = this.chain()

        // default alias: contract name
        const findProps = !aliasOrAddress ? {alias: contract} :
        this.global.ethers.utils.isAddress(aliasOrAddress) ? 
            {address: aliasOrAddress} : {alias: aliasOrAddress}
        
        const savedConfig = _getConfig({
            chain,
            ...findProps,
            contract,
            version
        })

        if(!savedConfig){
            if(findProps.address)
                throw Error(`${contract} Config for ${findProps.address} not found.\nPlease execute upsertConfig() first.`)
            else
                throw Error(`${contract} Config for ${findProps.address} not found.`)
        }

        // load relations
        this.relations.forEach(relation => {
            const {
                relatedConfig,
                propertyKey,
                relationType,
            } = relation;
            // relation type "Contract"
            if (relationType === "Contract") {
                Object.assign(savedConfig, {
                    [propertyKey]: 
                        Object.prototype.hasOwnProperty.call(savedConfig, propertyKey) ?
                            new relatedConfig(
                                _getConfig({
                                    contract: extractContractNameFromConfigName(
                                        relatedConfig.name
                                    ),
                                    chain,
                                    address: (savedConfig as any)[propertyKey]
                                })
                            ) 
                            : 
                            null
                });
            }
        })

        const config = new this.config.target(savedConfig) as Config;
        const artifact = this.global.artifacts.readArtifactSync(contract)
        const signer = await this.global.ethers.getSigners()

        return new BaseCraft(
            config.address,
            artifact.abi,
            signer[0],
            config
        ) as Craft;
    }


    async deploy(
        alias: string | null,
        options: CraftDeployOptions<DeployArgs>,
        customConfig?: CraftDeployConfig<Config>
    ):Promise<Craft>{
        const contract = this.contractName()
        const chain = this.chain()

        const log = (...msg: any) => {
            if(options.consoleLog !== false)
                console.log(...msg)
        }

        // default alias: contract name
        alias = alias || contract;

        /**
         * check if duplicated alias exists
         */
        const existing = _getConfig({
            contract, 
            chain,
            alias
        })
    
        let beforeDeployAddress = existing ? existing.address : "";
    
        const { deploy } = this.global.deployments;
        log(`Start deploy contract [${contract}]::${alias}`);
    
        const deployment = await deploy(
            alias, 
            { contract, ...options }
        );

        if(beforeDeployAddress === deployment.address && existing){
            const contractInfo = `Contract ${contract} with alias "${existing.alias}" already exists.\n` 
            + `Version: ${existing.version}\n`
            + `Address: ${existing.address}\n`
            + `Deployed At: ${new Date(existing.deployedAt * 1000)}\n\n`
            console.log(contractInfo);

            // not deployed in real
            return this.attach(
                alias,
                existing.version   // existing should be exists.
            )
        }

        const newVersion = existing ? +existing.version + 1 : 0;
        log(chalk.green(`** Contract [${contract}]::${alias} deployed! **\naddress: ${deployment.address}\nversion: ${newVersion}`))
    
        const config = {
            alias,
            address: deployment.address,
            version: newVersion,
            deployedAt: Math.floor(new Date().getTime() / 1000),
            ...(customConfig || {})
        } as unknown as Config
        
        _addConfig({
            chain,
            contract,
            newConfig: config
        })

        return this.attach(alias, newVersion);
    }

    async upsertConfig(
        {alias, ...config}: NewConfigProps<Config>, 
        versioning: Versioning = "maintain"
    ):Promise<Craft>{
        const contract = this.contractName()
        const chain = this.chain()
        
        // default alias: contract name
        alias = alias || contract;

        const configTarget = {
            chain,
            contract, 
            alias
        }

        const existing = _getConfig(configTarget)
        let newVersion;
        if(existing){
            newVersion = _updateConfig(
                {
                    ...configTarget,
                    version: existing.version
                }, 
                config, 
                versioning
            ).version;
        }
        else {
            _addConfig({
                chain,
                contract,
                newConfig: {
                    ...config,
                    alias,
                    version: 0,
                    deployedAt: 0
                }
            })
            newVersion = 0;
        }

        return this.attach(alias, newVersion);
    }

    async removeConfig(
        aliasOrAddress: string,
        version:ConfigVersion = 'latest'
    ):Promise<void> {
        const contract = this.contractName()
        const chain = this.chain()

        const findProps = !aliasOrAddress ? {alias: contract} :
            this.global.ethers.utils.isAddress(aliasOrAddress) ? 
                {address: aliasOrAddress} : {alias: aliasOrAddress};

        const configTarget = { chain, contract, version, ...findProps};
        const existing = _getConfig(configTarget)
        if(existing){
            _removeConfig({chain, contract, ...findProps, version: existing?.version})
        }
        else {
            throw Error(`removeConfig: No existing ${contract} config`);
        }
    }
}
