import "../styles/globals.css";
import "tailwindcss/tailwind.css";
// eslint-disable-next-line import/no-unresolved
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "@components/Modal";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
      <ModalProvider />
      <Analytics />
    </>
  );
}

export default MyApp;
