import { PrebuiltContractType } from "../core/types";
import { ChainId, SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "./chains";
import { constants } from "ethers";

/**
 * @internal
 */
export const OZ_DEFENDER_FORWARDER_ADDRESS =
  "0xC82Cef7e15871A96E528356409A177cD00fc81F1";

const TWRegistry_address = "0x5fd766aD7E861d12D3aBd6428fF19E363BDB8b7b";
const TWFactory_address = "0x52C60a2C70aB8c06AEe58f0ccb39bcf0eB919A21";
const ContractPublisher_address = "0x08ccbE7d6e8b128f94C21F42FC59FBf9AcaBBbbc"; // Polygon only

/**
 * @internal
 */
export const CONTRACT_ADDRESSES: Record<
  SUPPORTED_CHAIN_ID,
  {
    openzeppelinForwarder: string;
    openzeppelinForwarderEOA: string;
    biconomyForwarder: string;
    twFactory: string;
    twRegistry: string;
    twBYOCRegistry: string;
  }
> = {
  [ChainId.Mainnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },

  [ChainId.Goerli]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x3B32f5132EE1BaC2CBbb431C9A68D0841985c41b",
    biconomyForwarder: "0x6b02587486FE607a13d6cE3A1b846736a095DA03",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x2278f360795840FC75b3C2930b47d4e475fC0323",
  },
  [ChainId.Polygon]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.Mumbai]: {
    openzeppelinForwarder: "0x83b69703543B7240b2e8218f9Ca21255e007AD49",
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.Avalanche]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.AvalancheFujiTestnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    biconomyForwarder: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x0183EaFfF53061DfA5E1Ee2a528c30E140ab41CE",
  },
  [ChainId.Fantom]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.FantomTestnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.Arbitrum]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },

  [ChainId.ArbitrumGoerli]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.Optimism]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },

  [ChainId.OptimismGoerli]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.BinanceSmartChainMainnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
  [ChainId.BinanceSmartChainTestnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x29ce93BAD941e89b4661121195275C1132e777FE",
    biconomyForwarder: "0x170F1B2E15262860E65296A213Bff22f2378E189",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x9762ec95fc18FCbAe018d8f99D81FDBDE34019EF",
  },
};

type DropContract = Extract<
  PrebuiltContractType,
  "nft-drop" | "token-drop" | "edition-drop" | "signature-drop"
>;
export const APPROVED_IMPLEMENTATIONS: Record<
  SUPPORTED_CHAIN_ID,
  Record<DropContract, string>
> = {
  [ChainId.Mainnet]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.Polygon]: {
    "nft-drop": "0x106a6080ef4889458D25f4404a88f20B5b30f560",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.Fantom]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.Avalanche]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.Optimism]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.Arbitrum]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.BinanceSmartChainMainnet]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.Goerli]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.Mumbai]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.FantomTestnet]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.AvalancheFujiTestnet]: {
    "nft-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "edition-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "token-drop": "0x13B55C4573f75BE7124196E76A4e51a6f0b56dE4",
    "signature-drop": "0xe254b1b2F45DE3674A52331a96D9ad0797C064Bd",
  },
  [ChainId.OptimismGoerli]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.ArbitrumGoerli]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B",
  },
  [ChainId.BinanceSmartChainTestnet]: {
    "nft-drop": "0xC611709B38ab817f2201D6bb8C64D6DbF76EEe18",
    "edition-drop": "0xBF2d2c61a52a0Bb19626C6D00113672C566DfD65",
    "token-drop": "0x7d2dc0109C4a0251A626c3F728b7cC14407665F2",
    "signature-drop": "0xD9CEE8cB329Ea726F92A87Dc118A39Db3b93250B", // TODO
  },
};

/**
 * @internal
 * @param chainId
 * @param contractType
 */
export function getApprovedImplementation(
  chainId: SUPPORTED_CHAIN_ID, // TODO use SupportedChainId once we deploy to all chains
  contractType: PrebuiltContractType,
): string | null {
  if (chainId in APPROVED_IMPLEMENTATIONS) {
    const approvedImpls = APPROVED_IMPLEMENTATIONS[chainId];
    if (contractType in approvedImpls) {
      return approvedImpls[contractType as keyof typeof approvedImpls];
    }
  }
  return null;
}

/**
 * @internal
 */
export function getContractAddressByChainId(
  chainId: SUPPORTED_CHAIN_ID | ChainId.Hardhat,
  contractName: keyof typeof CONTRACT_ADDRESSES[SUPPORTED_CHAIN_ID],
): string {
  // for testing only
  if (chainId === ChainId.Hardhat) {
    if (contractName === "twFactory") {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      return process.env.factoryAddress as string;
    } else if (contractName === "twRegistry") {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      return process.env.registryAddress as string;
    } else {
      return constants.AddressZero;
    }
  }
  // real output here
  return CONTRACT_ADDRESSES[chainId][contractName];
}

/**
 * @internal
 */
export function getContractPublisherAddress() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.contractPublisherAddress) {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    return process.env.contractPublisherAddress as string;
  } else {
    return ContractPublisher_address;
  }
}

/**
 *
 * @param chainId - chain id
 * @returns the array of trusted forwarders for the given chain id
 * @internal
 */
export function getDefaultTrustedForwarders(
  chainId: SUPPORTED_CHAIN_ID,
): string[] {
  const chainEnum = SUPPORTED_CHAIN_IDS.find((c) => c === chainId);
  const biconomyForwarder = chainEnum
    ? CONTRACT_ADDRESSES[chainEnum].biconomyForwarder
    : constants.AddressZero;
  const openzeppelinForwarder = chainEnum
    ? CONTRACT_ADDRESSES[chainEnum].openzeppelinForwarder
    : constants.AddressZero;
  return biconomyForwarder !== constants.AddressZero
    ? [openzeppelinForwarder, biconomyForwarder]
    : [openzeppelinForwarder];
}
