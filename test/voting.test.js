const { expect } = require("chai");
const { ethers } = require("hardhat");

let VOTING, owner, addr1, addr2;

beforeEach(async function () {
    VOTING = await ethers.deployContract("Voting");
    [owner, addr1, addr2, _] = await ethers.getSigners();
});


describe("Deployment", function () {
    it("Should set the right owner", async () => {
        const admin = await VOTING.admin();
        expect(admin).to.equal(owner);
    });

    it("candidate count should be zero", async function () {
        const candidateCount = await VOTING.candidateCount();
        expect(candidateCount).to.equal(0);  
    });
})

describe("Creating candidates", function () {
    it("Should create a new candidate", async function () {
        const candidateName = "Candidate 1";
        await VOTING.addCandidate(candidateName);
        const candidateCount = await VOTING.candidateCount();
        expect(candidateCount).to.equal(1);
        const candidate = await VOTING.candidates(1)
        expect(candidate[0]).to.equal(candidateName);
    });

    it("Should revert if candidate name is empty", async function () {
        await expect(VOTING.addCandidate("")).to.be.revertedWith("name should not be empty");
    });

    it("candidate name should be unique", async function () {
        const candidateName1 = "Candidate 1";
        const candidateName2 = "Candidate 1";
        await VOTING.addCandidate(candidateName1);
        await VOTING.addCandidate(candidateName2);
        const candidateCount = await VOTING.candidateCount();  
        console.log(candidateCount)
        await expect(candidateCount).to.be.equal(1);
    });
})