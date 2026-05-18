// frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { MetaMaskProvider } from "@metamask/sdk-react";

ReactDOM.render(
  <React.StrictMode>
     {/* <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "MedyEth",
          url: window.location.href,
        },
        infuraAPIKey: process.env.INFURA_API_KEY,
        // Other options.
      }}
    > */}
    <App />
    {/* </MetaMaskProvider> */}
  </React.StrictMode>,
  document.getElementById("root"),
);
