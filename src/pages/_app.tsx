import { NetworkProvider } from "@/contexts/network";
import "../styles/global.scss";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <NetworkProvider>
        <Component {...pageProps} />
    </NetworkProvider>
  );
}

export default App;
