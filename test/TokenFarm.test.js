const { expect } = require("chai");

function parseEther(n) {
  return ethers.utils.parseEther(n);
}

describe("TokenFarm", function() {
  let DaiToken;
  let RetroToken;
  let TokenFarm;
  let daiToken;
  let retroToken;
  let tokenFarm;
  let owner;
  let investor;

  beforeEach(async () => {
    RetroToken = await ethers.getContractFactory("RetroToken");
    DaiToken = await ethers.getContractFactory("DaiToken");
    TokenFarm = await ethers.getContractFactory("TokenFarm");
    [owner, investor] = await ethers.getSigners();

    retroToken = await RetroToken.deploy();
    daiToken = await DaiToken.deploy();

    await retroToken.deployed();
    await daiToken.deployed();

    tokenFarm = await TokenFarm.deploy(retroToken.address, daiToken.address);
    await tokenFarm.deployed();

    await retroToken.transfer(tokenFarm.address, parseEther('1000000').toString());
    await daiToken.transfer(investor.address, parseEther('100').toString(), { from: owner.address });
  }); 

  describe('RetroToken deployment', async function() {
    it('has a name', async () => {
      expect(await retroToken.name()).to.equal('Retro Token');
    })
  });

  describe('Mock Dai deployment', async function() {
    it('has a name', async () => {
      expect(await daiToken.name()).to.equal('MOCK Dai Token');
    })
  });

  describe('Token Farm deployment', async function() {
    it('has a name', async () => {
      expect(await tokenFarm.name()).to.equal('Token Farm');
    })

    it('Contract has tokens', async () => {
      const balance = await retroToken.balanceOf(tokenFarm.address);
      expect(balance.toString()).to.equal(parseEther('1000000').toString());
    });
  });

  describe('Farming Tokens', async () => {
    it('Rewards investors for staking mDai tokens', async () => {
      let result;

      result = await daiToken.balanceOf(investor.address);
      expect(result.toString()).to.equal(
        parseEther('100').toString(), 
        'The investor mock dai balance should be 100'
      );
      
      // Stake Mock DAI Tokens
      await daiToken.connect(investor).approve(tokenFarm.address, parseEther('100'));
      await tokenFarm.connect(investor).stakeTokens(parseEther('100'));

      // Check staking result
      result = await daiToken.balanceOf(investor.address);
      expect(result.toString()).to.equal(
        parseEther('0').toString(), 
        'The investor mock dai balance should be 0'
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      expect(result.toString()).to.equal(
        parseEther('100').toString(),
        'The token farm mock dai balance should be 100'
      );

      result = await tokenFarm.stakingBalance(investor.address);
      expect(result.toString()).to.equal(
        parseEther('100').toString(),
        'The Investor staking balance should be 100'
      );

      result = await tokenFarm.isStaking(investor.address);
      expect(result.toString()).to.equal(
        'true',
        'The investor staking status should be true'
      );

      // Issue tokens
      await tokenFarm.connect(owner).issueTokens();

      // Check balances after issuance
      result = await retroToken.balanceOf(investor.address);
      expect(result.toString()).to.equal(
        parseEther('100').toString(),
        'The investor retro token balance should be 100'
      );

      // Ensure that only onwer can issue tokens
      await expect(tokenFarm.connect(investor).issueTokens()).to.be.reverted;

      // Unstacke tokens
      await tokenFarm.connect(investor).unstakeTokens();

      // Check results after unstaking
      result = await daiToken.balanceOf(investor.address);
      expect(result.toString()).to.equal(
        parseEther('100').toString(),
        'The investor mock dai balance should be 100'
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      expect(result.toString()).to.equal(
        parseEther('0').toString(),
        'The token farm dai balance should be 0'
      );

      result = await tokenFarm.stakingBalance(investor.address);
      expect(result.toString()).to.equal(
        parseEther('0').toString(),
        'The investor staking balance should be 0'
      );

      result = await tokenFarm.isStaking(investor.address);
      expect(result.toString()).to.equal(
        'false',
        'The investor staking status should be false'
      );
    });
  });
});