export const DEFAULT_IPFS_GATEWAY = "https://ipfs.web3sdks.com/ipfs/";

export interface IPFSResolverOptions {
  gatewayUrl: string;
}

export const DEFAULT_IPFS_RESOLVER_OPTIONS: IPFSResolverOptions = {
  gatewayUrl: DEFAULT_IPFS_GATEWAY,
};
