
async function main() {
  const TokenFarm = await ethers.getContractFactory("TokenFarm");
  const tokenFarm = await TokenFarm.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
  await tokenFarm.issueTokens();
  console.log('tokens issued');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('ERROR', error);
    process.exit(1);
  });