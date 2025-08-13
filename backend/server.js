import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// tiny health check so we know the server works
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
