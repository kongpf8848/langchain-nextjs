import { NextApiRequest, NextApiResponse } from "next";
import { Document } from "langchain/document";


export default async function (req: NextApiRequest, res: NextApiResponse) {
    const document=new Document({
        pageContent:"how are you",
        metadata:{
            source:"baidu",
            name:"jack"
        }
    })
    console.log("++++++++++"+document.pageContent)
    console.log("++++++++++"+document.metadata.name)
    console.log("++++++++++"+document.metadata.source)
    
    res.status(200).json({text:"ok"})
}