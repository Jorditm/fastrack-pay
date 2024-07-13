interface AbiInput {
  internalType: string;
  name: string;
  type: string;
  indexed?: boolean; // Add this line
}

interface AbiItem {
  inputs?: AbiInput[]; // Update to use AbiInput
  stateMutability?: string;
  type: string;
  name?: string;
  anonymous?: boolean;
  outputs?: { internalType: string; name: string; type: string }[];
}

export const abi: AbiItem[] = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address"
      }
    ],
    name: "CompanyAccountCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address"
      }
    ],
    name: "CustomerAccountCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    stateMutability: "payable",
    type: "fallback"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "accounts",
    outputs: [
      {
        internalType: "enum Factory.AccountType",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "contracts",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_company",
        type: "address"
      }
    ],
    name: "deployCompanyAccount",
    outputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_customer",
        type: "address"
      }
    ],
    name: "deployCustomerAccount",
    outputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    stateMutability: "payable",
    type: "receive"
  }
];