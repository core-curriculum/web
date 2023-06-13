import "../src/styles/globals.css";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { addons } from "@storybook/addons";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },

  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

const channel = addons.getChannel();
// switch html data-theme according to dark mode
channel.on(DARK_MODE_EVENT_NAME, isDark => {
  console.log(DARK_MODE_EVENT_NAME, isDark);
  if (isDark) {
    document.getElementsByTagName("html")[0].dataset.theme = "dark";
  } else {
    document.getElementsByTagName("html")[0].dataset.theme = "light";
  }
});
