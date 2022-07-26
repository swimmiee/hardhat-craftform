import { ModuleDeclarationKind, Project, VariableDeclarationKind } from "ts-morph";
import { useEnvironment } from "./helpers";

describe("Unit tests", function () {
  describe("Craftform", function () {
    useEnvironment("hardhat-project");
    
    it("should deploy properly", async function(){
      const {ethers, craftform} = this.hre;
      const [owner] = await ethers.getSigners();

      await craftform.deploy("Test1", {
        alias: "MyTest1",
        options: {
          from: owner.address,
          args: [123, "0x5FbDB2315678afecb367f032d93F642f64180aa3", "Hello"]
        }
      })
    })
  });

  it("Job module", async function(){
    // interface TestProps {
    //   x: number
    // }
    
    // const JobTestJob = job("Task Test Task", [
    //   step("Ready", function(params:TestProps){
    //       return params.x === 10;
    //   }, "설마..."),
    
    //   step("Predeploy", function(params:TestProps){
    //       return params.x+5 === 15;
    //   }, "설마..."),
    
    //   step("Deploy", function(params:TestProps){
    //       return params.x+10 === 20;
    //   }, "설마..."),
    
    //   step("PostDeploy", function(params:TestProps){
    //       return params.x+10 === 30;
    //   }, "설마...")
    // ])

    // await JobTestJob({x: 10}, 
    //   {
    //     log: {
    //       dirname: "haha",
    //       filename: "job",
    //     }, 
    //     saveLog: true,
    //     wait: 0.2
    //   }
    // )
  })

  it("ts-morph test", async function(){
    const project = new Project({})
    const definitionFile = project.createSourceFile(`testfolder/index.ts`, "", {overwrite: true})
    project.saveSync()
  })
});
