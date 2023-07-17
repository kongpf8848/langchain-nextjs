import {NextApiRequest, NextApiResponse} from "next";

import { OpenAI, OpenAIChat } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

const handler = async(req: NextApiRequest, res: NextApiResponse) => {
   const model = new ChatOpenAI({
      streaming: true,
      azureOpenAIApiKey: "xxx",
      azureOpenAIApiInstanceName: "xxx",
      azureOpenAIApiDeploymentName: "xxx",
      azureOpenAIApiVersion: "2023-03-15-preview",
      temperature: 0.9,
    });
   const response = await model.call([
      new SystemMessage(
         "You are an AI assistant that helps people find information."
      ),
      new HumanMessage(
          "who is elon mask"
      ),
  ]);
  res.status(200).json({ text: response})
}

export default handler;