export type Env = {
  DB: D1Database;
  MEDIA: R2Bucket;
  ASSETS?: Fetcher;
  JWT_SECRET: string;
};

export type AuthUser = {
  userId: string;
  email: string;
  role: string;
};
