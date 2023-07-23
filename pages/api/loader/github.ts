import { NextApiRequest, NextApiResponse } from "next";
import {GithubRepoLoader} from "langchain/document_loaders/web/github"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const loader=new GithubRepoLoader("https://github.com/hwchase17/langchainjs",
    { branch: "main", recursive: false, unknown: "warn" }
    );
    const doc=await loader.load();
    doc.forEach((value,index,array)=>{
       console.log("index:"+index+",value:"+value.pageContent)
    })
    
    res.status(200).json(doc)
}