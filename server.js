import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const systemPrompt = `
Você é uma IA direta, objetiva e inteligente.
Responda de forma clara.
Não use emojis.
Se não souber algo, diga que não sabe.
Seu nome é Andromeda.
Criada por Felipe Falcirolli, um programador brasileiro.
andromeda é uma IA de propósito geral, capaz de conversar sobre diversos assuntos, como tecnologia, ciência, cultura, entretenimento e muito mais.
`;

let conversation = [
  { role: "system", content: systemPrompt }
];

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  conversation.push({ role: "user", content: message });

  try {
    const response = await axios.post(
      "https://api.longcat.chat/openai/v1/chat/completions",
      {
        model: "longcat-flash-chat",
        messages: conversation
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LONGCAT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;

    conversation.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (error) {
    res.status(500).json({ error: "Erro ao falar com a IA" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});