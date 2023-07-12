//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./utils/AccessControl.sol";

contract UserHub is AccessControl {

    event RegisterSuccess(address owner, string publicKey);

    using Counters for Counters.Counter;
    Counters.Counter private _userCounter;

    // UserIdentity
    struct UserIdentity {
        string publicKey;
        string privateKey;
        uint256 userId;
    }

    constructor() {
        _userCounter.increment();
    }

    mapping(address => UserIdentity) private userMap;

    string[] private userPublicKeys;

    function registerUser(string memory publicKey, string memory privateKey) external returns (bool) {
        require(userMap[msg.sender].userId == 0,"user already exists");
        userMap[msg.sender] = UserIdentity(publicKey, privateKey, _userCounter.current());
        userPublicKeys.push(publicKey);
        _userCounter.increment();
        emit RegisterSuccess(msg.sender, publicKey);
        return true;
    }

    function getAllPublicKeys() external view returns(string[] memory) {
        return userPublicKeys;
    }

    function getUserInfo(address owner) external view returns(bool, UserIdentity memory) {
//        if (msg.sender != owner) {
//            require(hasRole());
//        }=
        if (userMap[msg.sender].userId == 0) {
            return (false,userMap[owner]);
        } else {
            return (true,userMap[owner]);
        }
    }

    function getUserPublicKey(address owner) external view returns(string memory) {
        return userMap[owner].publicKey;
    }

}
