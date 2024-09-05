/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-foundry");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config()

module.exports = {
  solidity: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      base: process.env.BASESCAN_API_KEY
    },
  },
  sourcify: {
    enabled: false
  },
  networks: {
    localhost: {
      //url: ``,
    },
    sepolia: {
      url: `https://sepolia.gateway.tenderly.co/${process.env.TENDERLY_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
    base: {
      url: `https://base.gateway.tenderly.co/${process.env.TENDERLY_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
    mainnet: {
      url: `https://mainnet.gateway.tenderly.co/${process.env.TENDERLY_API_KEY}`,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    }
  },
};
