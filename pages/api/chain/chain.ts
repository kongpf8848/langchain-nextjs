import { OpenAI, PromptTemplate } from "langchain";
import { LLMChain, SequentialChain, SimpleSequentialChain } from "langchain/chains";

import { NextApiRequest, NextApiResponse } from "next";
import { OPENAI_API_KEY, OPENAI_API_MODEL } from "../../../utils/const";
import { AZURE_OPENAI_API_KEY,AZURE_OPENAI_API_INSTANCE_NAME,AZURE_OPENAI_API_DEPLOYMENT_NAME } from '../../../utils/const';
import { AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,AZURE_OPENAI_API_VERSION } from '../../../utils/const';

export default async function (req: NextApiRequest, res: NextApiResponse) {


    const text = "阿尔茨海默病(Alzheimer's disease, AD),俗称老年痴呆症,是一种全身性神经退行性疾病，它是由大脑神经退行性变性引起的，\
主要表现为记忆力减退、思维能力减退、行为变化等。阿尔茨海默病的原因尚不十分清楚，但是研究表明，阿尔茨海默病可能与遗传因素、环境因素、\
营养不良、压力过大、不良生活习惯等有关。根据世界卫生组织的统计数据，全球有超过4700万人患有阿尔茨海默病，其中美国有超过600万人患有阿尔茨海默病，\
欧洲有超过1000万人患有阿尔茨海默病，亚洲有超过2500万人患有阿尔茨海默病，其中中国有超过1000万人患有阿尔茨海默病。阿尔茨海默病的发病率与年龄有关，\
随着年龄的增长而增加，65岁以上的人群为主要受害群体，占比高达80%，其中45-65岁的人群占比为15%，20-45岁的人群占比为5%。65岁以上的人群发病率约为10%，\
75岁以上的人群发病率约为20%，85岁以上的人群发病率约为30%。根据统计，男性患病率高于女性，男性患病比例为1.4：1，即男性患病率比女性高出40%。\
根据统计，阿尔茨海默病在不同的人种中分布情况也有所不同。白人患病率最高，占总患病率的70%，黑人患病率次之，占总患病率的20%，\
其他少数民族患病率最低，占总患病率的10%。阿尔茨海默病在不同的饮食习惯中分布情况也有所不同。维生素B12缺乏的人群患病率更高，\
而均衡膳食的人群患病率较低。阿尔茨海默病不仅会给患者带来记忆力减退、思维能力减退、行为变化等症状，还会给患者的家庭带来巨大的心理负担。\
因此，患者应尽快就医，及时进行治疗。治疗阿尔茨海默病的方法有药物治疗、行为治疗、认知行为治疗等，具体治疗方案要根据患者的具体情况而定。"

    const llm = new OpenAI({
        azureOpenAIApiKey:AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName:AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiDeploymentName:AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiEmbeddingsDeploymentName:AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
        azureOpenAIApiVersion:AZURE_OPENAI_API_VERSION
    })

    const controller=new AbortController()
    controller.abort()

    const promptTemplate = new PromptTemplate({
        template: "从下面的本文中提取关键事实。尽量使用文本中的统计数据来说明事实:\n\n {text_input}",
        inputVariables: ["text_input"]
    })
    const facts_chain = new LLMChain({
        prompt: promptTemplate,
        llm: llm,
    })

    const doctor_prompt = new PromptTemplate({
        template: "你是神经内科医生。根据以下阿尔茨海默病的事实统计列表，为您的病人写一个简短的预防阿尔茨海默病的建议。 不要遗漏关键信息：\n\n {facts}",
        inputVariables: ["facts"]
    })
    const doctor_chain = new LLMChain({
        llm: llm,
        prompt: doctor_prompt
    })

    const chain = new SimpleSequentialChain({
        chains: [
            facts_chain,
            doctor_chain
        ],
        verbose:true
    })

    const result=await chain.run(text)
    console.log("+++++++++doctor_suggest:\n" + result)

    res.status(200).json({ text: result })

}