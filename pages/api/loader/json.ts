import { NextApiRequest, NextApiResponse } from "next";
import { JSONLoader } from "langchain/document_loaders/fs/json"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const loader=new JSONLoader("assets/example/example.json")
    const doc=await loader.load();
    doc.forEach((value,index,array)=>{
       console.log("index:"+index+",value:"+value.pageContent)
    })
    
    res.status(200).json(doc)
}