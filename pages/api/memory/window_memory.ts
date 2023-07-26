import { OpenAI } from "langchain/llms/openai";
import { BufferWindowMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const model = new OpenAI({
        modelName:"gpt-3.5-turbo-16k",
        verbose:true
    });
    const memory = new BufferWindowMemory({ 
        k: 1
    });
    const chain = new ConversationChain({ llm: model, memory: memory });
    const res1 = await chain.call({ input: "Hi! I'm Jim." });
    console.log({ res1 });
        
    const res2 = await chain.call({ input: "What's my name?" });
    console.log({ res2 });

    const res3 = await chain.call({ input: "Who is the President of the United States" });
    console.log({ res3 });

    res.status(200).json({text:"ok"})
}
