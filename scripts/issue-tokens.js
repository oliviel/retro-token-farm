async function main() {
  const fs = require('fs');
  const addressDir = __dirname + '/../src/abis/tokenfarm-address.json';

  if (!fs.existsSync(addressDir)) {
    throw new Error('Token Farm address is required, run the deploy script first');
  }

  const data = fs.readFileSync(addressDir, 'utf8');

  const address = JSON.parse(data);

  const tokenFarm = await ethers.getContractAt('TokenFarm', address.TokenFarm);
  const tx = await tokenFarm.issueTokens();
  await tx.wait();
  console.log('tokens issued');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('ERROR', error);
    process.exit(1);
  });
