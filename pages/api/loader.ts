import { NextApiRequest, NextApiResponse } from "next";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const loader = new UnstructuredLoader(
        "assets/example/fake-email.eml",
    );
    const docs = await loader.load();
    docs.forEach((value,index,array)=>{
        console.log("+++++++++eml1:" + JSON.stringify(value.metadata));
        console.log("+++++++++eml2:" + value.pageContent);
    })

    res.status(200).json({ text: "abcd" })
};
