import { NextApiRequest, NextApiResponse } from "next";

import { OpenAI, OpenAIChat } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader, JSONLinesLoader, } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   //    const model = new ChatOpenAI({
   //       streaming: true,
   //       azureOpenAIApiKey: "xxx",
   //       azureOpenAIApiInstanceName: "xxx",
   //       azureOpenAIApiDeploymentName: "xxx",
   //       azureOpenAIApiVersion: "2023-03-15-preview",
   //       temperature: 0.9,
   //     });
   //    const response = await model.call([
   //       new SystemMessage(
   //          "You are an AI assistant that helps people find information."
   //       ),
   //       new HumanMessage(
   //           "who is elon mask"
   //       ),
   //   ]);

   // const loader = new DirectoryLoader("../../assets/example",
   //    {
   //       ".json": (path) => new JSONLoader(path, "/texts"),
   //       ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
   //       ".txt": (path) => new TextLoader(path),
   //       ".csv": (path) => new CSVLoader(path, "text"),
   //    }
   // );
   // const docs = await loader.load();
   // console.log({ docs });
   if (req.method !== 'POST') {
      res.status(400).json({ text: "error" })
      return;
  }
   
   res.status(200).json({ text: "哈哈" })
}

export default handler;