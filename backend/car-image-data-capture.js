import dotenv from 'dotenv';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage  } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import cors from 'cors';
import express from 'express';
import { z } from "zod";

// api keys
dotenv.config();
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors()); // Use the cors middleware


async function callLlm(userImageInput){
    // instantiate llm model
    const model = new ChatOpenAI({ model: "gpt-4o" }); //gpt-3.5-turbo

    const carDetails = z.object({
        make: z.string().describe("The car make"),
        colour: z.string().describe("The car colour"),
        license_plate: z.number().optional().describe("The license plate represented as a string."),
    });

    let prompt = ChatPromptTemplate.fromMessages([
        new AIMessage({
          content: "You are a useful bot that returns car make, car colour and license plate for every image you see."
        }),
        new HumanMessage({
          content: [
            { "type": "text", 
              "text": "Identify the car make, colour and number plate in this image. Only give 3 words as output."
            },
            {
              "type": "image_url",
              "image_url": {
                "url": "data:image/jpeg;base64," + userImageInput
              }
            }
          ]
        })
      ])

    let chain = prompt
        .pipe(model.withStructuredOutput(carDetails))
        // .pipe(new CustomListOutputParser({ separator: `\n` }))

    let response = await chain.invoke()
    
    // invoke GPT models
    // const gptOutput = await model.invoke(messages);
    console.log('gpt response on backend:', response);
    return(response);
}

app.post('/invoke-llm', async (req, res) => {
    try {
        
        let gptOutput = await callLlm(req.body.Image);

        res.status(200).send(gptOutput);
      } catch (err) {
        console.error('Error invoking LLM:', err);
        res.status(500).send('Internal Server Error');
      }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});