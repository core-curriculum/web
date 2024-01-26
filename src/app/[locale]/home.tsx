"use client";

import { GeneralGuidance } from "@components/GeneralGuidance";
import { MainLayout } from "@components/MainLayout";
import { OutcomesTree } from "@components/Outcomes";
import { MenuItem, OutcomesTOC } from "@components/OutcomesTOC";
import type { Tree } from "@libs/treeUtils";
import { useLocaleText } from "@services/i18n/i18n";
import type { OutcomeInfo } from "@services/outcomes";

type PageProps = { outcomesTree: Tree<OutcomeInfo> };

const Home = ({ outcomesTree }: PageProps) => {
  const { t } = useLocaleText("@pages/index");
  return (
    <>
      <MainLayout
        content={
          <>
            <GeneralGuidance
              className="m-4 mx-auto my-[min(10vh,5rem)] 
            w-[clamp(20rem,80%,800px)]"
            />
            <h1 className="m-4 text-6xl font-thin">{t("outcomesTitle")}</h1>
            <p className="m-6">{t("discription")}</p>
            <OutcomesTree outcomesTree={outcomesTree} />
          </>
        }
        menu={
          <menu>
            <OutcomesTOC outcomesTree={outcomesTree} />
            <MenuItem href="./tables">{t("tables")}</MenuItem>
          </menu>
        }
      />
    </>
  );
};

export { Home };
