import { NextApiRequest, NextApiResponse } from "next";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI } from "langchain";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { AZURE_OPENAI_API_KEY,AZURE_OPENAI_API_INSTANCE_NAME,AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_VERSION } from '../../../utils/const';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    
    const memory=await MemoryVectorStore.fromTexts(
        ["Hello world", "Bye bye", "hello nice world"],
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        new OpenAIEmbeddings({
            azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
            azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
            azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
            azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
            azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION
        })
    )

    const result=await memory.similaritySearch("hello world",1)
    console.log("+++++++++++++++result:"+result)


    res.status(200).json(result)


}