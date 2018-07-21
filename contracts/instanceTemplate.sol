pragma solidity ^0.4.0;

contract instanceTemplate {
    string public contractName;
    uint public gameType;
    address public creator;
    uint public creationTime;
    uint public historyTotalCoins;
    uint public liveId;

    function getPublicData() public constant returns (string, uint, address, uint, uint){
        return (contractName, gameType, creator, creationTime, historyTotalCoins);
    }

    //获取liveID
    function getLiveId() public constant returns(uint){
        return liveId;
    }

    function deposit() public payable { }

    function drawings(uint _coin) payable { }
}
