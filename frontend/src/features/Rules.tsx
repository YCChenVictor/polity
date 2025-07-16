import LawShow from "./rules/LawShow";
import RuleProposals from "./rules/RuleProposals";

import RawLaw from "../laws/ChLaw.json";

interface Article {
  ArticleNo: string;
  ArticleContent: string;
}

interface Law {
  LawLevel: string;
  LawName: string;
  LawURL: string;
  LawCategory: string;
  LawModifiedDate: string;
  LawEffectiveDate: string;
  LawEffectiveNote: string;
  LawAbandonNote: string;
  LawHasVersion: string;
  LawPublishDate: string;
  LawID: string;
  LawArticles: Article[];
}

interface LawJson {
  Laws: Law[];
}

function Rules({ governmentAddress }: { governmentAddress: `0x${string}` }) {
  const laws = (RawLaw as unknown as LawJson).Laws;

  return (
    <>
      <LawShow laws={laws} />
      <RuleProposals address={governmentAddress} />
    </>
  );
}

export default Rules;
