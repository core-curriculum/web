import "../styles/globals.css";
import "tailwindcss/tailwind.css";
// eslint-disable-next-line import/no-unresolved
import { Analytics } from "@vercel/analytics/react";
import { Provider as JotaiProvider } from "jotai";
import type { AppProps } from "next/app";
import { ModalProvider } from "@components/Modal";
import { ToastProvider } from "@components/toast";
import { defaultStore } from "@services/store";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <JotaiProvider store={defaultStore}>
      <Component {...pageProps} />
      <ToastProvider />
      <ModalProvider />
      <Analytics />
    </JotaiProvider>
  );
}

export default MyApp;
