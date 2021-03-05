require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    }
  },
  solidity: "0.7.3",
};
