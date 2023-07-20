import { OpenAI } from "langchain/llms/openai";
import { APIChain } from "langchain/chains";

import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OPENAI_API_KEY, OPENAI_API_MODEL } from "../../utils/const";
import { AZURE_OPENAI_API_KEY,AZURE_OPENAI_API_INSTANCE_NAME,AZURE_OPENAI_API_DEPLOYMENT_NAME } from '../../utils/const';
import { AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,AZURE_OPENAI_API_VERSION } from '../../utils/const';

const OPEN_METEO_DOCS = `BASE URL: https://api.open-meteo.com/`

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const llm = new ChatOpenAI({
        azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION
    })

    const chain = APIChain.fromLLMAndAPIDocs(llm, OPEN_METEO_DOCS, {
        headers: {
            // These headers will be used for API requests made by the chain.
        },
        verbose:true
    });
    
    const result = await chain.call({
        question: "上海昨天天气怎么样",
    });
    console.log({ result });

    res.status(200).json({ text: "ok" })
}