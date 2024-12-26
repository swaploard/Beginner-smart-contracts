// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    address public admin;
    uint256 public candidateCount = 0;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin can call this function");
        _;
    }

    function memcmp(
        bytes memory a,
        bytes memory b
    ) internal pure returns (bool) {
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }

    function strcmp(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return memcmp(bytes(a), bytes(b));
    }

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(
        string memory _name
    ) public onlyAdmin returns (string memory) {
        require(bytes(_name).length > 0, "name should not be empty");

        for (uint i = 1; i <= candidateCount; i++) {
            if (strcmp(candidates[i].name, _name)) {
                return "Candidate already exists";
            }
        }
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, 0);
        return "New candidate added";
    }

    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate ID"
        );

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    function getCandidates(
        uint256 _candidateId
    ) public view returns (string memory, uint256) {
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate ID"
        );

        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function getWinner() public view returns (Candidate memory) {
        Candidate storage winner = candidates[1];

        for (uint i = 2; i <= candidateCount; i++) {
            if (winner.voteCount < candidates[i].voteCount) {
                winner = candidates[i];
            }
        }

        return winner;
    }
}
