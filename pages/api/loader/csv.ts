import { NextApiRequest, NextApiResponse } from "next";
import {CSVLoader} from "langchain/document_loaders/fs/csv"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const loader=new CSVLoader("assets/example/example.csv")
    const doc=await loader.load();
    doc.forEach((value,index,array)=>{
       console.log("index:"+index+",value:"+value.pageContent)
    })
    
    res.status(200).json(doc)
}