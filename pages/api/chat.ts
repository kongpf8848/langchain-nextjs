import {NextApiRequest, NextApiResponse} from "next";

const handler = async(req: NextApiRequest, res: NextApiResponse) => {
   res.status(200).json({
    text: "hello world"
   })
}

export default handler;