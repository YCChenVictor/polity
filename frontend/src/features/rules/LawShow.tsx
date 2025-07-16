import React from "react";

interface Article {
  ArticleNo: string;
  ArticleContent: string;
}

export interface Law {
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

interface Props {
  laws: Law[];
}

const LawList: React.FC<Props> = ({ laws }) => {
  return (
    <div className="space-y-6">
      {laws.map((law, idx) => (
        <div key={idx} className="border rounded-xl p-4 shadow">
          <a
            href={law.LawURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold underline"
          >
            {law.LawName} {law.LawName ? `(${law.LawName})` : ""}
          </a>
          <p className="text-sm text-gray-500">
            最後修正：{law.LawModifiedDate}
          </p>
          <ul className="mt-3 space-y-2">
            {law.LawArticles.slice(0, 10).map((art, aIdx) => (
              <li key={aIdx}>
                <span className="font-semibold">{art.ArticleNo} </span>
                {art.ArticleContent}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LawList;
