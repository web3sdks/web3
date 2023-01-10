import { ConnectWallet, Web3sdksProvider } from "@web3sdks/react";
import React from "react";
import ReactDOM from "react-dom/client";

const KitchenSink = () => {
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <KitchenSink />
  </React.StrictMode>,
);
