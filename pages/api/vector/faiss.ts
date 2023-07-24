import { NextApiRequest, NextApiResponse } from "next";

import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { AZURE_OPENAI_API_KEY,AZURE_OPENAI_API_INSTANCE_NAME,AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_VERSION } from '../../../utils/const';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    
    const embeddings= new OpenAIEmbeddings({
        azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION
    })

    const vectorStore=await FaissStore.fromTexts(
        ["Hello world", "Bye bye", "hello nice world"],
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        embeddings
    )

    const directory = "/Users/kongpengfei/Desktop/ai/vector";
    await vectorStore.save(directory)

    vectorStore.asRetriever()

    // Load the vector store from the same directory
    const loadedVectorStore = await FaissStore.load(
         directory,
         embeddings
    );
    const result=await loadedVectorStore.similaritySearch("hello world",1)
    console.log("+++++++++++++++result:"+result)


    res.status(200).json(result)


}