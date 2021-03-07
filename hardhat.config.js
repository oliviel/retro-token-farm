require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      chainId: 4,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  solidity: "0.7.3",
};
