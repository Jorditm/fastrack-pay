import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FactoryModule = buildModule("FactoryModule", (m) => {
  const factory = m.contract("Factory", [
    "0xd8253782c45a12053594b9deB72d8e8aB2Fca54c" // Gelato Relay
  ]);
  return { factory };
});

export default FactoryModule;