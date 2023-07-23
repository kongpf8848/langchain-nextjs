import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain";
import { AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_INSTANCE_NAME, AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_VERSION } from "../../utils/const";

export default async (req: NextApiRequest, res: NextApiResponse) => {


    res.status(200).json({ text: "ok" })
};
