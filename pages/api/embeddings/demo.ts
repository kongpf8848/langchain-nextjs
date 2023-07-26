import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { NextApiRequest, NextApiResponse } from "next";
import {TextLoader} from "langchain/document_loaders/fs/text"
import { AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_INSTANCE_NAME, AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_VERSION } from "../../../utils/const";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const embeddings = new OpenAIEmbeddings({
        // azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        // azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        // azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        // azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        // azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION,
        timeout: 10000, // 1s timeout
      });
      /* Embed queries */
      const result = await embeddings.embedQuery("Hello world");
      console.log(result);
      /* Embed documents */
      const documentRes = await embeddings.embedDocuments(["Hello world", "Bye bye"]);
      console.log({ documentRes });
    
    res.status(200).json({text:"ok"})
}