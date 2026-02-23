import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.longcat.chat/openai/v1/chat/completions",
      {
        model: "longcat-flash-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant. Don't use markdown format." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LONGCAT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao falar com a IA" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});