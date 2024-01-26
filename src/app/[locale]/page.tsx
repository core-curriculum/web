import { getCurrentLocale } from "@locales/server";
import { GeneralGuidance } from "@components/GeneralGuidance";
import { loadOutcomesTree } from "@services/outcomes";

const Page = async () => {
  const locale = getCurrentLocale();
  const outcomesTree = await loadOutcomesTree(locale);
  return <Home {...{ outcomesTree }} />;
};

export default GeneralGuidance;
