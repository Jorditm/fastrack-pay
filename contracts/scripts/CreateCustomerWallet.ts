import hre from "hardhat";

async function main() {
  const [acc0, acc1] = await hre.viem.getWalletClients();

  /*const factory = await hre.viem.getContractAt(
    "Factory",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    {
      client: {
        wallet: acc1
      }
    }
  );

  const publicClient = await hre.viem.getPublicClient();

  const hash = await factory.write.deployCustomerAccount([acc1.account.address]);
  const receipt = await publicClient.waitForTransactionReceipt({hash});
  const contractAddress = "0x" + receipt.logs[1].data.slice(-40);*/

  const customerWallet = await hre.viem.getContractAt(
    "CustomerWallet",
    "0xa16e02e87b7454126e5e10d957a927a7f5b5d2be",
    {
      client: {
        wallet: acc1
      }
    }
  );
  console.log(await customerWallet.read.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
