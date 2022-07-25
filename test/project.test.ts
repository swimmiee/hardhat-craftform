import { ModuleDeclarationKind, Project, VariableDeclarationKind } from "ts-morph";
import { useEnvironment } from "./helpers";

describe("Unit tests", function () {
  describe("Craftform", function () {
    useEnvironment("hardhat-project");
    
    it("should use crafts properly", async function(){
      // await this.hre.run("deploy", {
      //   network: 'hardhat',
      //   tags: "test-crafts"
      // })
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
    // indexFile.addVariableStatement(
    //   {
    //     declarationKind: VariableDeclarationKind.
    //   }
    // )

    // definitionFile.addExportDeclaration(
    //   {
    //     isTypeOnly: true,
    //     is
        
    //   }
    // )
    definitionFile.addTypeAlias({
      isExported: true,
      name: "asd",
      type: "asdasdada"
    })


    // const runtimeModule = definitionFile.addModule({
    //   declarationKind: ModuleDeclarationKind.Module,
    //   hasDeclareKeyword: true,
    //   name: "\"hardhat/types/runtime\""
    // })

    // runtimeModule.addFunction({
    //   name: "asda",
    //   parameters: [
    //     {name: "asd", type: "number"}
    //   ],
    //   returnType: {

    //   }
    // })


    project.saveSync()
  })
});
