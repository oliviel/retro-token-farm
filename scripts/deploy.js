async function main() {
  // We get the contract to deploy
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const [deployer, investor] = await ethers.getSigners();

  const investorAddress = await investor.getAddress();

  const RetroToken = await ethers.getContractFactory("RetroToken");
  const DaiToken = await ethers.getContractFactory("DaiToken");
  const TokenFarm = await ethers.getContractFactory("TokenFarm");


  const retroToken = await RetroToken.deploy();
  const daiToken = await DaiToken.deploy();

  await retroToken.deployed();
  await daiToken.deployed();

  const tokenFarm = await TokenFarm.deploy(retroToken.address, daiToken.address);
  await tokenFarm.deployed();

  await retroToken.transfer(tokenFarm.address, '1000000000000000000000000');
  await daiToken.transfer(investorAddress, '200000000000000000000');

  console.log('The DAITOKEN ADDRESS', daiToken.address);

  saveFrontendFiles(retroToken, 'RetroToken');
  saveFrontendFiles(daiToken, 'DaiToken');
  saveFrontendFiles(tokenFarm, 'TokenFarm');
}

function saveFrontendFiles(token, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name.toLowerCase()}-address.json`,
    JSON.stringify({ [name]: token.address }, undefined, 2)
  );

  const artifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(artifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


  