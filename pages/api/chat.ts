import { NextApiRequest, NextApiResponse } from "next";

import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "langchain/prompts";

import { OPENAI_API_KEY, OPENAI_API_MODEL,DEFAULT_SYSTEM_PROMPT } from "../../utils/const";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'POST') {
      res.status(400).json({ text: "api only support POST" })
      return;
   }
   res.writeHead(
      200,{
         "Content-Type": "text/event-stream",
         "Cache-Control": "no-cache",
         "Connection": "keep-alive",
         "Access-Control-Allow-Origin": "*"
      })

   var message = req.body.message
   console.log("++++++++++++++reqeust message:" + message)
   const encoder = new TextEncoder();
   const chat = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: OPENAI_API_MODEL,
      maxTokens: 1000,
      temperature: 0,
      streaming: true,
      verbose: true,
      callbacks: CallbackManager.fromHandlers({
         handleLLMNewToken: async (token: string) => {
            var json=JSON.stringify({text:token})
            res.write(encoder.encode(`data: ${json}\n\n`))
         },
         handleLLMEnd: async () => {
            res.write(encoder.encode(`data: [DONE]\n\n`))
         },
         handleLLMError: async (e) => {

         },
      }),
   });

   const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
         DEFAULT_SYSTEM_PROMPT      
         ),
      HumanMessagePromptTemplate.fromTemplate("{text}"),
   ]);

   const chain = new LLMChain({
      prompt: chatPrompt,
      llm: chat,
   });

   await chain.call({
      text: message
   });

   res.end()

}

export default handler;