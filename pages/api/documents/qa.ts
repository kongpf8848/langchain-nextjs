import { NextApiRequest, NextApiResponse } from "next";

import { OpenAI } from "langchain/llms/openai";
import {loadQAStuffChain,loadQAMapReduceChain,loadQARefineChain} from "langchain/chains";
import { Document } from "langchain/document";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_INSTANCE_NAME, AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_VERSION } from "../../../utils/const";

export default async (req: NextApiRequest, res: NextApiResponse) => {
   
    const llm = new ChatOpenAI({
        azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION
    })

    const chainA = loadQAStuffChain(llm)

    const docs = [
        new Document({ pageContent: "Harrison went to Harvard." }),
        new Document({ pageContent: "Ankush went to Princeton." }),
    ];

    const resA = await chainA.call({
        input_documents: docs,
        question: "Where did Harrison go to college?",
    });

    console.log({ resA });

    res.status(200).json(resA)


}