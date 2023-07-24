import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_INSTANCE_NAME, AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_VERSION } from "../../../utils/const";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const chat = new ChatOpenAI({
        azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION,
    });

    const memory = new BufferMemory();

    const chain = new ConversationChain({ llm: chat, memory });

    const res1 = await chain.run("Answer briefly. What are the first 3 colors of a rainbow?");
    console.log(res1);

    // The first three colors of a rainbow are red, orange, and yellow.

    const res2 = await chain.run("And the next 4?");
    console.log(res2);

    res.status(200).json({ text: "ok" })
};
