import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "langchain/prompts";

import { OPENAI_API_KEY,OPENAI_API_MODEL} from "../../utils/const";

export const config = {
    runtime: "edge",
};

const handler = async (req: NextApiRequest, res: NextApiResponse)=>{

    // if (req.method !== 'POST') {
    //     res.status(400).json({ text: "api only support POST" })
    //     return;
    // }

    console.log("++++++++++++++reqeust body:"+req.body)
    var message=req.body.message
    console.log("++++++++++++++reqeust message:"+message)

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
        text: message
    });

    return new NextResponse(stream.readable, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache",
            "Connection":"keep-alive",
            "Access-Control-Allow-Origin":"*"
        },
    });

}

export default handler;

