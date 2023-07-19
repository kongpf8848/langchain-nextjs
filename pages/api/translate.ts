import { NextApiRequest, NextApiResponse } from "next";

import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "langchain/prompts";

import { OPENAI_API_KEY, OPENAI_API_MODEL } from "../../utils/const";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  
    const chat = new ChatOpenAI({
       openAIApiKey: OPENAI_API_KEY,
       modelName: OPENAI_API_MODEL,
       maxTokens: 1000,
       temperature: 0,
       verbose: true,
    });
 
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
       SystemMessagePromptTemplate.fromTemplate(
          "You are a helpful assistant that translates {input_language} to {output_language}."
       ),
       HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);
 
    const chain = new LLMChain({
       prompt: chatPrompt,
       llm: chat,
    });
 
    const result=await chain.call({
       input_language: "English",
       output_language: "Chinese",
       text: "I love programming."
    });
 
    res.status(200).json(result)
 
 }
 
 export default handler;

