import { MediaRenderer, SharedMediaProps } from "./MediaRenderer";
import { NFTMetadata } from "@web3sdks/sdk";
import React from "react";

/**
 * The props for the {@link Web3sdksNftMedia} component.
 */
export interface Web3sdksNftMediaProps extends SharedMediaProps {
  /**
   * The NFT metadata of the NFT returned by the web3sdks sdk.
   */
  metadata: NFTMetadata;
}

/**
 * This component can be used to render NFTs from the web3sdks SDK.
 * Props: {@link Web3sdksNftMediaProps}
 *
 * @example
 * ```jsx
 * import { Web3sdksNftMedia, useContract, useNFT } from "@web3sdks/react";
 * export default function NFTCollectionRender() {
 *   const { contract } = useContract(<your-contract-address>);
 *   const { data: nft, isLoading } = useNFT(contract, 0);
 *
 *   return (
 *     <div>
 *       {!isLoading && nft ? (
 *         <Web3sdksNftMedia metadata={nft.metadata} />
 *       ) : (
 *         <p>Loading...</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const Web3sdksNftMedia = React.forwardRef<
  HTMLMediaElement,
  Web3sdksNftMediaProps
>(({ metadata, ...props }, ref) => {
  return (
    <MediaRenderer
      src={metadata.animation_url || metadata.image}
      poster={metadata.image}
      alt={metadata.name?.toString() || ""}
      ref={ref}
      {...props}
    />
  );
});

Web3sdksNftMedia.displayName = "Web3sdksNftMedia";
