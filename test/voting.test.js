const { expect, should } = require("chai");
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
});

describe("Voting", function () {
    
    it("Should vote for a candidate", async function () {
        const candidateName = "Candidate 1";
        await VOTING.addCandidate(candidateName);
        await VOTING.vote(1);
        const candidate = await VOTING.candidates(1);
        expect(candidate[1]).to.equal(1);
    });

    it("Voter cant vote twice", async function () {    
        const candidateName = "Candidate 1";    
        await VOTING.addCandidate(candidateName);           
        await VOTING.vote(1);
        await expect(VOTING.vote(1)).to.be.revertedWith("You have already voted");
    });

    it("Should revert if candidate ID is invalid", async function () {
        await expect(VOTING.vote(0)).to.be.revertedWith("Invalid candidate ID");
    });

    it("Vote count should be updated", async function () {      
        const candidateName = "Candidate 1";
        await VOTING.addCandidate(candidateName);
        await VOTING.vote(1);
        const candidate = await VOTING.candidates(1);
        expect(candidate[1]).to.equal(1);
    });
});

describe("Retrieving candidates", function () {
    it("Should retrieve a specific candidate", async function () {    
        const candidateName = "Candidate 1";
        await VOTING.addCandidate(candidateName);        
        const candidate = await VOTING.getCandidates(1);        
        expect(candidate[0]).to.equal(candidateName);        
    });

    it("Should revert if candidate ID is invalid", async function () {        
        await expect(VOTING.getCandidates(0)).to.be.revertedWith("Invalid candidate ID");        
    });        
});

describe("Winning candidate", function () {
    it("Should return the winning candidate", async function () {        
        const candidateName1 = "Candidate 1";        
        const candidateName2 = "Candidate 2";     
    
        await VOTING.connect(owner).addCandidate(candidateName1);        
        await VOTING.connect(owner).addCandidate(candidateName2);        
        await VOTING.connect(addr1).vote(1);    
        await VOTING.connect(addr2).vote(2);
        await VOTING.connect(owner).vote(2);        
        const winner = await VOTING.getWinner();   
        const candidate = await VOTING.candidates(2);
        expect(winner[1]).to.equal(candidate[1]);        
    });        
}); 
 