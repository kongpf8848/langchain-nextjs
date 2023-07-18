import { NextApiRequest, NextApiResponse } from "next";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { TextLoader } from "langchain/document_loaders/fs/text";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const loader = new TextLoader(
        "assets/example/example.txt"
    );
    const docs = await loader.load();
    docs.forEach((value,index,array)=>{
        console.log("+++++++++txt:" + value.pageContent);
    })
    unstr

    
    res.status(200).json({ text: "abcd" })
};
