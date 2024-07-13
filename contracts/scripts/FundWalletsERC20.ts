import hre from "hardhat";

async function main() {
  const [acc0, acc1] = await hre.viem.getWalletClients();

  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
