import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import { NextResponse } from "next/server";

import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "langchain/prompts";
import { NextApiRequest, NextApiResponse } from "next";
import { OPENAI_API_KEY,OPENAI_API_MODEL} from "../../utils/const";

export const runtime = "edge";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    //const body = await req.body();
    //console.log("++++++++++++++++requestBody:"+body)
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const chat = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY,
        modelName: OPENAI_API_MODEL,
        maxTokens: 1000,
        temperature: 0,
        streaming: true,
        verbose: true,
        callbacks: CallbackManager.fromHandlers({
            handleLLMNewToken: async (token: string) => {
                await writer.ready;
                await writer.write(
                    encoder.encode(`data: ${token.replace(/["'\n\r]/g, "")}\n\n`)
                );
            },
            handleLLMEnd: async () => {
                await writer.ready;
                await writer.write(
                    encoder.encode(`data: [DONE]\n\n`)
                );
                await writer.close();
            },
            handleLLMError: async (e) => {
                await writer.ready;
                await writer.abort(e);
            },
        }),
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


    chain.call({
        input_language: "English",
        output_language: "Chinese",
        //text: "Large language models (LLMs) are emerging as a transformative technology, enabling developers to build applications that they previously could not. However, using these LLMs in isolation is often insufficient for creating a truly powerful app - the real power comes when you can combine them with other sources of computation or knowledge.",
        text: "who is bill gates"
    });

    return new NextResponse(stream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection":"keep-alive",
            "Access-Control-Allow-Origin":"*"
        },
    });

}

export default handler;
