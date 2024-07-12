import { loadFixture, mine } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { viem } from "hardhat";
import { parseEther } from "ethers";

enum AccountType {
  NOT_REGISTERED,
  CUSTOMER,
  COMPANY,
}

describe("FastrackPay", async () => {
  async function deployFactory() {
    const [us, anotherUs, customer, company] = await hre.viem.getWalletClients();

    const factory = await hre.viem.deployContract("Factory", [], {
      value: parseEther("1"),
      client: {
        wallet: anotherUs
      }
    });

    const publicClient = await hre.viem.getPublicClient();

    return {
      factory,
      us,
      anotherUs,
      customer,
      company,
      publicClient
    };
  }

  let customerContractAddress: `0x${string}`;
  let companyContractAddress: `0x${string}`;
  let customerContract: any;
  let companyContract: any;
  

  describe("Factory", () => {
    it("Should deploy", async () => {
      const { factory } = await loadFixture(deployFactory);
      expect(factory).to.exist;
    });
    it("Should have the correct owner", async () => {
      const { factory, anotherUs } = await loadFixture(deployFactory);
      const owner = await factory.read.owner()
      expect(owner.toLowerCase()).to.be.equal(anotherUs.account.address.toLowerCase());
    });
    it("Only the current owner can call transferOwnership", async () => {
      const { factory, customer } = await loadFixture(deployFactory);

      const factoryAsNotOwner = await hre.viem.getContractAt("Factory", factory.address, {
        client: {
          wallet: customer
        }
      })

      await expect(factoryAsNotOwner.write.transferOwnership([customer.account.address])).to.be.rejected
    });
    it("Should let choose another owner", async () => {
      const { factory, us } = await loadFixture(deployFactory);
      await factory.write.transferOwnership([us.account.address]);
    });
    it("Should be able to deploy a new customer contract", async () => {
      const { factory, customer, publicClient } = await loadFixture(deployFactory);
      const hash = await factory.write.deployCustomerAccount([customer.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const address = "0x" + receipt.logs[1].data.slice(-40);
      expect(address).to.exist;
      customerContractAddress = address as `0x${string}`;
      customerContract = await hre.viem.getContractAt("CustomerWallet", customerContractAddress, {
        client: {
          wallet: customer
        }
      })
    });
    it("Should be able to deploy a new company contract", async () => {
      const { factory, company, publicClient } = await loadFixture(deployFactory);
      const hash = await factory.write.deployCompanyAccount([company.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const address = "0x" + receipt.logs[1].data.slice(-40);
      expect(address).to.exist;
      companyContractAddress = address as `0x${string}`;
      companyContract = await hre.viem.getContractAt("CompanyWallet", companyContractAddress, {
        client: {
          wallet: company
        }
      })
      await mine(1);
    })
    it("Customer should have right owner", async () => {
      const { customer } = await loadFixture(deployFactory);
      customerContract = await hre.viem.getContractAt("CustomerWallet", customerContractAddress, {
        client: {
          wallet: customer
        }
      })
      const owner = await customerContract.read.owner();
      expect(owner.toLowerCase()).to.be.equal(customer.account.address.toLowerCase());
    })
    
  });
});