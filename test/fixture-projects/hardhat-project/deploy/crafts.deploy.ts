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