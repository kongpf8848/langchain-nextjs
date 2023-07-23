import { NextApiRequest, NextApiResponse } from "next";
import {TextLoader} from "langchain/document_loaders/fs/text"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const loader=new TextLoader("assets/example/example.txt")
    const doc=await loader.load();
    doc.forEach((value,index,array)=>{
       console.log("index:"+index+",value:"+value.pageContent)
    })
    
    res.status(200).json(doc)
}