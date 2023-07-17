import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "langchain/prompts";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const chat = new ChatOpenAI({ 
        openAIApiKey:process.env.OPENAI_API_KEY,
        modelName:"gpt-3.5-turbo-16k",
        maxTokens:1000,
        temperature: 0,
        verbose:true
    });

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            "You are a helpful assistant that translates {input_language} to {output_language}."
        ),
        HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);

    const chain = new LLMChain({
        prompt: chatPrompt,
        llm: chat,
    });

    const response = await chain.call({
        input_language: "English",
        output_language: "Chinese",
        text: "Large language models (LLMs) are emerging as a transformative technology, enabling developers to build applications that they previously could not. However, using these LLMs in isolation is often insufficient for creating a truly powerful app - the real power comes when you can combine them with other sources of computation or knowledge.",
    });

    console.log(response);
    res.status(200).json(response)

}

export default handler;
