import { NextApiRequest, NextApiResponse } from "next";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
    This is a weird text to write, but gotta test the splittingggg some how.\n\n
    Bye!\n\n-H.`;
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 10,
        chunkOverlap: 1
    })
    const doc = await splitter.splitDocuments([new Document({
        pageContent: text
    })])
    doc.forEach((value, index, array) => {
        console.log("index:" + index + ",value:" + value.pageContent)
    })



    res.status(200).json(doc)
}