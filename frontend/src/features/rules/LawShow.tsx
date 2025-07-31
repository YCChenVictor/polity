import React from "react";
import { LawJson } from "../../models/law";

const LawList: React.FC<LawJson> = ({ Laws }) => {
  return (
    <div className="space-y-6">
      {Laws.map((law, idx) => (
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
