import { NextApiRequest, NextApiResponse } from "next";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
  } from "langchain/prompts";
  import { BufferMemory } from "langchain/memory";

export default async function (req: NextApiRequest, res: NextApiResponse) {
     const chat = new ChatOpenAI({ temperature: 0 });
     const chatPrompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
          "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
        ),
        new MessagesPlaceholder("history"),
        HumanMessagePromptTemplate.fromTemplate("{input}")
     ])

     const chain=new ConversationChain({
        llm:chat,
        prompt:chatPrompt,
        memory:new BufferMemory({
           returnMessages:true,
           memoryKey:"history"
        })
     })

     const response=await chain.call({
        input:"hi! what up?"
     })

     console.log("+++++++++++"+response)
     
     res.status(200).json({text:"ok"})

}