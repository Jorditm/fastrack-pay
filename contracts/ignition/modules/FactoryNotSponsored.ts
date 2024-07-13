import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FactoryNotSponsoredModule = buildModule("FactoryNotSponsoredModule", (m) => {
  const factory = m.contract("FactoryNotSponsored");
  return { factory };
});

export default FactoryNotSponsoredModule;