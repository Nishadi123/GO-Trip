import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKEY = process.env.API_KEY;
const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("<h1>Welcome To GoTrip API 🤗</h1>").status(200);
});

app.get("/status", (req, res) => {
  res
    .json({
      status: "🚀 Up And Running...",
    })
    .status(500);
});

app.post("/generate", async (req, res) => {
  try {
    const { expectations, ydestination, ylocation, ybudget, duration } =
      await req.body;

    // Prompt for the AI model
    const advice = `I'm in the process of planning a trip. I am from ${ylocation} and I need to go to ${ydestination}, and I'll be staying there for ${duration} days. My budget for this trip is ${ybudget}, and I have specific expectations related to ${expectations}.`;

    // Initiate the AI model
    const genAI = new GoogleGenerativeAI(apiKEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = advice;
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Format the response
    let formattedResponse = response.text();
    formattedResponse = formattedResponse
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>")
      .toString();

    // Send the response to the client-side
    res.status(200).json(formattedResponse);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on PORT: ${PORT}`);
});
