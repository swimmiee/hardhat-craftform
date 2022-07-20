import { assert } from "chai";
import path from "path";
import { Craftform } from "../src/core";
import { useEnvironment } from "./helpers";

describe("Integration test", function () {
    describe("Hardhat Runtime Environment extension", function () {
  
      useEnvironment("hardhat-project");
  
      it("Should add the craftform field", function () {
        console.log(this.hre.craftform)
        assert.instanceOf(this.hre.craftform, Craftform);
      });
    });
  
    describe("HardhatConfig extension", function () {
      useEnvironment("hardhat-project");
  
      it("Should add the <crafts> path to the config", function () {
        assert.equal(
          this.hre.config.paths.crafts,
          path.join(process.cwd(), "crafts")
        );
      });
    });
  });