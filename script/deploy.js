const hre = require("hardhat");

async function main() {

  const initializer = (await hre.ethers.getSigners())[0];

  const tokenArgs = [
    'CRYSTALPAD DN404 Token',
    'CRYSTALPAD_DN404',
    '',
    hre.ethers.parseEther('10000'),   // 'tokens' in one NFT
    '22',                                    // total NFTs minted
    true,
  ];
  const crystalDN404 = await hre.ethers.deployContract("CrystalDN404", tokenArgs);
  await crystalDN404.waitForDeployment();
  await crystalDN404.setBaseURI('https://gateway.pinata.cloud/ipfs/QmYsFCjgQaofMM7fEiFYcYQmpwsC3sc34Tj8QijqZvhwaH/');

  const crystalDN404MirrorAddress = await crystalDN404.mirrorERC721();
  const crystalDN404Mirror = await hre.ethers.getContractAt("DN404Mirror", crystalDN404MirrorAddress);
  console.log(
    `CrystalDN404 is deployed to ${crystalDN404.target} with the mirror ${crystalDN404MirrorAddress}`
  );

  //verify
  if (hre.network.name !== 'localhost') {
    console.log('Waiting before verification....')
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(10000);
    await hre.run("verify:verify", {
      address: crystalDN404.target,
      constructorArguments: tokenArgs,
    });
    // npx hardhat verify --network sepolia ADDRESS  "CRYSTALPAD DN404 Token" "CRYSTALPAD_DN404" "" "10000000000000000000000" "22" "true"
    await hre.run("verify:verify", {
      address: crystalDN404MirrorAddress,
      constructorArguments: [initializer.address],
    });
  }
  //console.log('Initializers balance ' + await crystalDN404.balanceOf(initializer));
  //console.log('Initializers balance NFT ' + await crystalDN404Mirror.balanceOf(initializer));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
