//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Test1 {
    uint u_init;
    address payer;
    string s_init;
    
    constructor(
        uint u1,
        address a1,
        string memory s1
    ){
        u_init = u1;
        payer = a1;
        s_init = s1;
    }

    function thisIsPureFunction() external pure returns(uint){
        return 100;
    }

    function thisIsViewFunction(
        uint mul
    ) external view returns(uint){
        return u_init * mul;
    }


    function thisIsNonPayableFunction(
        uint added
    ) public {
        u_init += added;
    }

    function thisIsPayableFunction() public payable{
        payer = msg.sender;
    }
}
