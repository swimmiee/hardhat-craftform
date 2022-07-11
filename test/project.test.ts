// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";
import { address, uint } from "../core";
// import { Test1Config, Test1Craft } from "./fixture-projects/hardhat-project/crafts";
// import { Test1 } from "./fixture-projects/hardhat-project/typechain";

import { useEnvironment } from "./helpers";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names"

// describe("Integration test", function () {
//   describe("Hardhat Runtime Environment extension", function () {

//     useEnvironment("hardhat-project");

//     it("Should add the craftform field", function () {
//       console.log(this.hre.craftform)
//       assert.instanceOf(this.hre.craftform, Craftform);
//     });
//   });

//   describe("HardhatConfig extension", function () {
//     useEnvironment("hardhat-project");

//     it("Should add the <crafts> path to the config", function () {
//       assert.equal(
//         this.hre.config.paths.crafts,
//         path.join(process.cwd(), "crafts")
//       );
//     });
//   });
// });


describe("Unit tests", function () {
  describe("Craftform", function () {
    useEnvironment("hardhat-project");
    
    it("Should add crafts & relations to hre", async function(){
      // await import("./fixture-projects/hardhat-project/crafts")

      const { craftform, getNamedAccounts, tasks, run } = this.hre;
      const { deployer } = await getNamedAccounts();

    //   class Test1Config  {
    //     static contractName: string
        
    //     // required field
    //     address!: string
    
    //     // write down your extra config...
    //     // test2!: Test2Config    
    // }

      // await craftform.deploy<[uint, address, string]>("Test1", {
      //   args: [143537, deployer, "Hello!!!"],
      //   from: deployer
      // })

      // const craft = await craftform.get("Test1", {
      //     chain: "baobab",
      //     address: "0xa74980c07aA4680257149b97F463631f076c146a"
      // })


      // console.log(craft)

      // await run("craftform", {
      //   reset: true
      // })
      await run("compile")
      
    })
  });
});
