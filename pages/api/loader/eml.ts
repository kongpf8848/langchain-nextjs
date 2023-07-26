import { NextApiRequest, NextApiResponse } from "next";
import {simpleParser} from "mailparser"
import { EmailLoader } from "../../../utils/EmailLoader";

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const loader = new EmailLoader("assets/example/example.eml");

    const doc=await loader.load();

    doc.forEach((value,index,array)=>{
        console.log("index:"+index+",+++++value:"+value.pageContent)
        console.log("index:"+index+",+++++metadata:"+JSON.stringify(value.metadata))
   
     })
    res.status(200).json({text:"ok"})
}