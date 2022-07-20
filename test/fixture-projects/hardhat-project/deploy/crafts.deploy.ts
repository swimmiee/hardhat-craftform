import { DeployFunction } from "hardhat-deploy/dist/types";
import "../crafts"

const TestDeployer:DeployFunction = async (hre) => {
    const { 
        ethers:{getContractFactory}, 
        deployments: {deploy},
        getNamedAccounts, 
        network,
        craftform
    } = hre

    const { deployer } = await getNamedAccounts()

    const test1 = await craftform.get(
        "Test1",
        {
            chain: "hardhat",
            alias: "my test1"
        }
    )
    console.log(test1.$config)

    // test1.$config.test2.update({
    //     fire:"asdasd"
    // }, {
    //     versioning: 'upgrade'
    // })
    // @ts-ignore
//    console.log(craftform.__configs)

    // const test2Addr = test1.config.test2.address

    // await craftform.deploy('Test1', {
    //     alias: "iboUSDT",
    //     config: {
    //         test2: test2Addr
    //     },
    //     options: {
    //         from: deployer,
    //         args: [1121023, deployer, "Hello, World!!"],
    //     }
    // })


    // interface TestProps {
    //     x: number
    //   }
      
    //   const JobTestJob = job("Task Test Task", [
    //     step("Ready", function(params:TestProps){
    //         return params.x === 10;
    //     }, "설마..."),
      
    //     step("Predeploy", function(params:TestProps){
    //         return params.x+5 === 15;
    //     }, "설마..."),
      
    //     step("Deploy", function(params:TestProps){
    //         return params.x+10 === 20;
    //     }, "설마..."),
      
    //     step("PostDeploy", function(params:TestProps){
    //         return params.x+10 === 30;
    //     }, "설마...")
    // ])
  
    // await JobTestJob(
    //     {x: 10}, 
    //     {
    //         stepByStep: true,
    //         wait: 1,
    //         saveLog: true
    //     }
    // )
}

TestDeployer.tags=["test-crafts"]

export default TestDeployer