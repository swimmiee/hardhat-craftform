// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";
import { Test1Craft } from "./crafts";
import { Test1 } from "./fixture-projects/hardhat-project/typechain";

import { useEnvironment } from "./helpers";

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
      await import("./crafts")

      const { craftform } = this.hre;


      class Test1Config  {
        static contractName: string
        
        // required field
        address!: string
    
        // write down your extra config...
        // test2!: Test2Config    
    }

      const craft = await craftform.get<Test1Craft>(
        Test1Config,
        {
          chain: "baobab",
          address: "0xa74980c07aA4680257149b97F463631f076c146a"
        }
      )
    })
  });
});
