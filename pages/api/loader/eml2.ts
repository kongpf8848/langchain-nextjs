import { NextApiRequest, NextApiResponse } from "next";
import {AddressObject, simpleParser} from "mailparser"
import { EmailLoader } from "../../../utils/EmailLoader";
import fs from "fs"

export default async function (req: NextApiRequest, res: NextApiResponse) {


    const text=await fs.promises.readFile("assets/example/AIGC.eml","utf8") 
    const parser = await simpleParser(text);

    console.log("++++++++++++"+parser.subject)

    console.log("+++++++++++++++++++++++from+++++++++++++++++++++++++")
    console.log("++++++++++++"+parser.from?.text)
    console.log("++++++++++++"+parser.from?.value)
    console.log("++++++++++++"+parser.from?.html)
    console.log("++++++++++++"+parser.from?.value[0].name)
    console.log("++++++++++++"+parser.from?.value[0].address)

    console.log("+++++++++++++++++++++++to+++++++++++++++++++++++++")
    console.log("++++++++++++"+(parser.to as AddressObject).text)
    console.log("++++++++++++"+(parser.to as AddressObject).value)
    console.log("++++++++++++"+(parser.to as AddressObject).html)

    console.log("+++++++++++++++++++++++date+++++++++++++++++++++++++")
    console.log("++++++++++++"+parser.date)
    console.log("++++++++++++"+parser.date?.toLocaleDateString())

    console.log("+++++++++++++++++++++++messageId+++++++++++++++++++++++++")
    console.log("++++++++++++"+parser.messageId)


    console.log("+++++++++++++++++++++++attachments+++++++++++++++++++++++++")
    parser.attachments.forEach((value,key,map)=>{
        console.log("++++++++++key:"+key)
        console.log("++++++++++cid:"+value.cid)
        console.log("++++++++++contentDisposition:"+value.contentDisposition)
        console.log("++++++++++contentId:"+value.contentId)
        console.log("++++++++++contentType:"+value.contentType)
        console.log("++++++++++filename:"+value.filename)
        console.log("++++++++++size:"+value.size)
    })
 
   

    res.status(200).json({text:"ok"})
}