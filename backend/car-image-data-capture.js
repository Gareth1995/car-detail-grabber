import dotenv from 'dotenv';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import cors from 'cors';
import express from 'express';

// api keys
dotenv.config();
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors()); // Use the cors middleware


async function callLlm(userInput){
    // instantiate llm model
    const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

    // form llm prompt
    const messages = [
      new SystemMessage("You are a vision model that gives only 3 values car make, colour and number plate"),
      new HumanMessage(userInput),
    ];
    
    // invoke GPT models
    const gptOutput = await model.invoke(messages);
    return(gptOutput);
}

app.post('/invoke-llm', async (req, res) => {
    try {
        
        // let gptOutput = await callLlm(req.body.input);
        console.log(typeof req.body.Image);

        res.status(200).send(req.body);
      } catch (err) {
        console.error('Error invoking LLM:', err);
        res.status(500).send('Internal Server Error');
      }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});