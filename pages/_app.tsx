import "../styles/globals.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { FC } from "react";
import { ManagedUIContext } from "@components/ui/context";

const Noop: FC = ({ children }) => <>{children}</>;
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ManagedUIContext>
        <Component {...pageProps} />
      </ManagedUIContext>
    </SessionProvider>
  );
}

export default MyApp;
