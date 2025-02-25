import { NetworkProvider } from "@/contexts/network";
import "../styles/global.scss";
import type { AppProps } from "next/app";
import { config } from "@/components/Wallet/config";
import { ChainProvider, ReactiveDotProvider } from "@reactive-dot/react";
import { Suspense, useEffect, useState } from "react";

function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <NetworkProvider>
      <ReactiveDotProvider config={config}>
        <ChainProvider chainId="polkadot">
          <Suspense>
            <Component {...pageProps} />
          </Suspense>
        </ChainProvider>
      </ReactiveDotProvider>
    </NetworkProvider>
  );
}

export default App;
