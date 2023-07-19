import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { NextApiRequest, NextApiResponse } from 'next';
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAI } from 'langchain/llms/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains'
import { OPENAI_API_KEY, OPENAI_API_MODEL } from '../../utils/const';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    
    const model = new OpenAI({
        openAIApiKey: OPENAI_API_KEY,
        modelName: OPENAI_API_MODEL,
     });

    const memory = new BufferMemory()

    const chain=new ConversationChain({
        llm:model,
        memory:memory,
        verbose:true
    })

    const res1 = await chain.call({ input: "What's my name?" });

    res.status(200).json({text:"ok"})

}
