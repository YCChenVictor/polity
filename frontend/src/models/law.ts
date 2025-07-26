export interface Article {
  ArticleType: string;
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
  LawHasEngVersion: string;
  EngLawName: string;
  LawHistories: string;
  LawForeword: string;
  LawAttachements: unknown[];
  LawArticles: Article[];
}

export interface LawJson {
  Laws: Law[];
  UpdateDate?: string;
}
