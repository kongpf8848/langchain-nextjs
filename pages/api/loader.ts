import { NextApiRequest, NextApiResponse } from "next";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const loader = new UnstructuredLoader(
        "assets/example/example.eml"
    );
    const docs = await loader.load();
    docs.forEach((value,index,array)=>{
        console.log("+++++++++eml2:" + JSON.stringify(value.metadata));
    })

    res.status(200).json({ text: "abcd" })
};
