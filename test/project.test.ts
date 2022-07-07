// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";
import { CraftLike } from "../core";
import { Craftform } from "../src/craftform/class";
import { Test1 as Test1Config, Test1Craft } from "./crafts";
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

      
      const craft = await craftform.get<Test1, Test1Config>(
        Test1Craft,
        {
          chain: "baobab",
          address: "0xa74980c07aA4680257149b97F463631f076c146a"
        }
      )
      // craft.

      console.log(craft)
    })
  });
});
