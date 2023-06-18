import "../styles/globals.css";
import "tailwindcss/tailwind.css";
// eslint-disable-next-line import/no-unresolved
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { ModalProvider } from "@components/Modal";
import { ToastProvider } from "@components/toast";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastProvider />
      <ModalProvider />
      <Analytics />
    </>
  );
}

export default MyApp;
