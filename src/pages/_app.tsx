import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ConfirmDialog } from "@hooks/useConfirmDialog";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
      <ConfirmDialog />
    </>
  );
}

export default MyApp;
