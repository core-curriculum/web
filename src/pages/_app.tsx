import "../styles/globals.css";
import "tailwindcss/tailwind.css";
// eslint-disable-next-line import/no-unresolved
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ConfirmDialog } from "@hooks/useConfirmDialog";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
      <ConfirmDialog />
      <Analytics />
    </>
  );
}

export default MyApp;
