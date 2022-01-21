import "../styles/globals.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { FC, useState } from "react";
import { ManagedUIContext } from "@components/ui/context";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const Noop: FC = ({ children }) => <>{children}</>;
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider session={session}>
      <ManagedUIContext>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ManagedUIContext>
    </SessionProvider>
  );
}

export default MyApp;
