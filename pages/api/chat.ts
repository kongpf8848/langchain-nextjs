import { NextApiRequest, NextApiResponse } from "next";

import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import { ChatPromptTemplate, HumanMessagePromptTemplate, PipelinePromptTemplate, PromptTemplate, SystemMessagePromptTemplate, } from "langchain/prompts";

import { OPENAI_API_KEY, OPENAI_API_MODEL,DEFAULT_SYSTEM_PROMPT } from "../../utils/const";
import { AZURE_OPENAI_API_KEY,AZURE_OPENAI_API_INSTANCE_NAME,AZURE_OPENAI_API_DEPLOYMENT_NAME } from '../../utils/const';
import { AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,AZURE_OPENAI_API_VERSION } from '../../utils/const';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   res.writeHead(
      200,{
         "Content-Type": "text/event-stream",
         "Cache-Control": "no-cache",
         "Connection": "keep-alive",
         "Access-Control-Allow-Origin": "*"
      })

   const encoder = new TextEncoder();
   const chat = new ChatOpenAI({
      azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
      azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION,
      maxTokens: 1000,
      temperature: 0.9,
      streaming: true,
      verbose: true,
      callbacks: CallbackManager.fromHandlers({
         handleLLMNewToken: async (token: string) => {
            var json=JSON.stringify({text:token})
            res.write(encoder.encode(`data: ${json}\n\n`))
         },
         handleLLMEnd: async () => {
            res.write(encoder.encode(`data: [DONE]\n\n`))
         },
         handleLLMError: async (e) => {

         },
      }),
   });

   const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
         DEFAULT_SYSTEM_PROMPT      
         ),
      HumanMessagePromptTemplate.fromTemplate("{text}"),
   ]);

   const chain = new LLMChain({
      prompt: chatPrompt,
      llm: chat,
   });

   const fullPrompt = PromptTemplate.fromTemplate(`{introduction}

   {example}
   
   {start}`);
   
   const introductionPrompt = PromptTemplate.fromTemplate(
     `You are impersonating {person}.`
   );
   
   const examplePrompt =
     PromptTemplate.fromTemplate(`Here's an example of an interaction:
   Q: {example_q}
   A: {example_a}`);
   
   const startPrompt = PromptTemplate.fromTemplate(`Now, do this for real!
   Q: {input}
   A:`);
   
   const composedPrompt = new PipelinePromptTemplate({
     pipelinePrompts: [
       {
         name: "introduction",
         prompt: introductionPrompt,
       },
       {
         name: "example",
         prompt: examplePrompt,
       },
       {
         name: "start",
         prompt: startPrompt,
       },
     ],
     finalPrompt: fullPrompt,
   });
   
   const formattedPrompt = await composedPrompt.format({
     person: "Elon Musk",
     example_q: `What's your favorite car?`,
     example_a: "Telsa",
     input: `What's your favorite social media site?`,
   });

   await chain.call({
      text: formattedPrompt
   });

   res.end()

}

export default handler;