import { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const loader=new PDFLoader("assets/example/example.pdf")
    const doc=await loader.load();
    doc.forEach((value,index,array)=>{
       console.log("index:"+index+",value:"+value.pageContent)
    })
    
    res.status(200).json(doc)
}