import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/gemini.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ status: 'Server is running' });
  });

app.use("/api/gemini", geminiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
