import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { NextApiRequest, NextApiResponse } from 'next';
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MarkdownTextSplitter, TextSplitter } from 'langchain/text_splitter';
import { loadQAChain, loadQAStuffChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { AZURE_OPENAI_API_KEY,AZURE_OPENAI_API_INSTANCE_NAME,AZURE_OPENAI_API_DEPLOYMENT_NAME } from '../../utils/const';
import { AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,AZURE_OPENAI_API_VERSION } from '../../utils/const';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const text = "高考报名人数近年一直呈现明显的上涨趋势，那么2023年各省高考人数是多少？2023年全国高考人数能达到多少人？2023全国参加高考人数有多少？2023年高考人数比2023年多吗？各省市高考人数排名如何？在本文小编整理了全国各地历年高考人数统计一览表，并附上2023年全国各地高考人数排行榜，可供同学们参考。\n \
2023年湖南高考报名人数共有68.4万人。其中普通高考报名人数50.97万人，比上年增加1.27万人（首选物理的考生有30.93万人，占比60.68%；首选历史的考生有20.04万人，占比39.32%）；对口升学考试报名人数16.69万人，比上年增加1.49万人；少年班等其他考生约0.74万人，与上年基本持平。\n \
2023年甘肃省高考报名人数共计247848人，比去年增加4600人。其中，参与普通高考考场编排考生196678人，共设置15个考区，195个考点，6967个考场。不参与统一高考考场编排考生51170人，包括高等职业教育分类考试招生综合评价录取23068人，中职升学考试 27965人、消防单招68人，残障生（不参加全国统考）44人，单设考场25人。"

    const splitter = new MarkdownTextSplitter({
        chunkSize: 100, // 一个块中最大的token数量
        chunkOverlap: 50, // 相邻块之间重叠字符的数量。默认值为200个Token。块和块之间添加重叠的文本有助于模型获取更多上下文信息
    });
    // 将上下文向量化
    const output = await splitter.splitText(text);

    output.forEach((value, index, array) => {
        console.log("+++++++++index:",index,",value:",value);
    })

    const embeddings=new OpenAIEmbeddings({
        azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION
  
    })
    const vectorStore=await FaissStore.fromTexts(
        output,
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        embeddings);

        const prompt = "湖南高考报名人数"
        const topK = 3;
        // 搜索最相关的topK个块
        const searchResult = await vectorStore.similaritySearch(prompt, topK);
        console.log("+++++++++searchResult:",searchResult);
        const llm=new ChatOpenAI({
            azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
            azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
            azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
            azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
            azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION,
            verbose:true
        })
        const stuffChain=loadQAStuffChain(llm)
        const result=await stuffChain.call({
            input_documents:searchResult,
            question:"湖南高考人数是多少？"
        })

        

        res.status(200).json(result)

}