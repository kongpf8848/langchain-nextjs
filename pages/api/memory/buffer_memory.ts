import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory,ChatMessageHistory } from "langchain/memory";
import { HumanMessage, AIMessage } from "langchain/schema";

import { ConversationChain } from "langchain/chains";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const model = new OpenAI({
        modelName:"gpt-3.5-turbo-16k"
    });
    const memory = new BufferMemory({
        memoryKey:"history"
    });

    const chain = new ConversationChain({ 
        llm: model, 
        memory: memory,
        verbose:true, 
    });
    const res1 = await chain.call({ input: "Hi! I'm Jim." });
    console.log({ res1 });

    const res2 = await chain.call({ input: "What's my name?" });
    console.log({ res2 });

    //ChatMessageHistory
    const pastMessages=[
        new HumanMessage("My name's Jonas"),
        new AIMessage("Nice to meet you, Jonas!")
    ]

    const chatHistoryList=new ChatMessageHistory(pastMessages)
    chatHistoryList.addMessage(new HumanMessage("hello"))
    chatHistoryList.addMessage(new AIMessage("how can I assist you?"))

    const memory2=new BufferMemory({
        chatHistory:chatHistoryList,
    });


    
    res.status(200).json({text:"ok"})
}