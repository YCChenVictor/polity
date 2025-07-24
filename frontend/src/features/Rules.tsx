import LawShow from "./rules/LawShow";

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

function Rules() {
  const laws = (RawLaw as unknown as LawJson).Laws;

  return (
    <>
      <LawShow laws={laws} />
    </>
  );
}

export default Rules;
