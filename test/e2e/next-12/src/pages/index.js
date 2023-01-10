import { ConnectWallet, Web3sdksProvider } from "@web3sdks/react";

export const KitchenSink = () => {
  return (
    <Web3sdksProvider>
      <WrappedKitchenSink />
    </Web3sdksProvider>
  );
};

const WrappedKitchenSink = () => {
  return (
    <div id="kitchen-sink">
      <ConnectWallet />
    </div>
  );
};

export default function Home() {
  return <KitchenSink />;
}
