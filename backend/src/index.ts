import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { connectDb } from "./database.js";
import reviewRoutes from "./routes/reviews.js";
import commentRoutes from "./routes/comments.js";

const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/reviews", reviewRoutes);
app.use("/reviews/:reviewId/comments", commentRoutes);

await connectDb();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
