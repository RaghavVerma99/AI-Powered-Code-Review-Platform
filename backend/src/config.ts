import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/code_review",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  corsOrigins: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
};
