import { NextApiRequest, NextApiResponse } from "next";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI } from "langchain";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { AZURE_OPENAI_API_KEY,AZURE_OPENAI_API_INSTANCE_NAME,AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_VERSION } from '../../../utils/const';

import { Chroma } from "langchain/vectorstores/chroma";
import { TextLoader } from "langchain/document_loaders/fs/text";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    
    // Create docs with a loader
    const loader = new TextLoader("assets/example/example.txt");
    const docs = await loader.load();

    // Create vector store and index the docs
    const vectorStore = await Chroma.fromDocuments(docs,  new OpenAIEmbeddings({
        azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION
    }), {
        collectionName: "a-test-collection",
     });
  
     // Search for the most similar document
    const response = await vectorStore.similaritySearch("hello", 1);

    console.log(response);

    res.status(200).json(response)


}