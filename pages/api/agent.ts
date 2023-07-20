import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";
import { NextApiRequest, NextApiResponse } from "next";
import { Calculator } from "../../utils/tools/Calculator"
import { initializeAgentExecutorWithOptions } from "langchain/agents";


import { AZURE_OPENAI_API_DEPLOYMENT_NAME, AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, AZURE_OPENAI_API_INSTANCE_NAME, AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_VERSION } from "../../utils/const";
import { VectorStoreQATool } from "langchain/tools";

export default async function (req: NextApiRequest, res: NextApiResponse) {

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
        console.log("+++++++++index:", index, ",value:", value);
    })

    const model = new ChatOpenAI({
        azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName: AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
        maxTokens: 1000,
        temperature: 0,
        verbose: true,
    });

    const embeddings = new OpenAIEmbeddings({
        azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName: AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION

    })

    const vector = await FaissStore.fromTexts(output, output, embeddings);

    const vecToolName = 'vector-search';
    const vecToolDescription = '一种知识搜索工具，用于从大量信息中提取所需信息。如果无法直接获得有用信息，请尝试将其分解。';

    const tools = [
        new VectorStoreQATool(
            vecToolName,
            vecToolDescription, {
            vectorStore: vector,
            llm: model
        }),
        new Calculator(),
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: 'zero-shot-react-description',
        verbose: true,
    })

    // 用户提问
    const input = '湖南高考报名人数加上甘肃高考报名人数的和，具体到多少个人，用中文回答';
    // 结果: 湖南高考报名人数加上甘肃高考报名人数结果为931848
    const result = await executor.call({ input });

    res.status(200).json({result})


}
