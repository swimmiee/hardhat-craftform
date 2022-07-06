// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";

import { Craftform } from "../src/craftform/class";

import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the craftform field", function () {
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

describe("Unit tests", function () {
  describe("Craftform", function () {
    // describe("sayHello", function () {
    //   it("Should say hello", function () {
    //   });
    // });
  });
});
