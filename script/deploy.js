const hre = require("hardhat");

async function main() {

  const initializer = (await hre.ethers.getSigners())[0];

  const tokenArgs = [
    'CUSTOM DN404 Token',
    'CUSTOM_DN404',
    '',
    hre.ethers.parseEther('10000'),   // 'tokens' in one NFT
    '22',                                    // total NFTs minted
    true,
  ];
  const customDN404 = await hre.ethers.deployContract("CustomDN404", tokenArgs);
  await customDN404.waitForDeployment();
  await customDN404.setBaseURI('https://gateway.pinata.cloud/ipfs/QmYsFCjgQaofMM7fEiFYcYQmpwsC3sc34Tj8QijqZvhwaH/');

  const customDN404MirrorAddress = await customDN404.mirrorERC721();
  const customDN404Mirror = await hre.ethers.getContractAt("DN404Mirror", customDN404MirrorAddress);
  console.log(
    `CustomDN404 is deployed to ${customDN404.target} with the mirror ${customDN404MirrorAddress}`
  );

  //verify
  if (hre.network.name !== 'localhost') {
    console.log('Waiting before verification....')
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(10000);
    await hre.run("verify:verify", {
      address: customDN404.target,
      constructorArguments: tokenArgs,
    });
    // npx hardhat verify --network sepolia ADDRESS  "CUSTOM DN404 Token" "CUSTOM_DN404" "" "10000000000000000000000" "22" "true"
    await hre.run("verify:verify", {
      address: customDN404MirrorAddress,
      constructorArguments: [initializer.address],
    });
    // npx hardhat verify --network sepolia ADDRESS  "0xC6AC25a9edefb3368710c0Aef5fC387691CA0e3A"
  }
  //console.log('Initializers balance ' + await customDN404.balanceOf(initializer));
  //console.log('Initializers balance NFT ' + await customDN404Mirror.balanceOf(initializer));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
