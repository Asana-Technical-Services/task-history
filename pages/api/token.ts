// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    const verifierUUID = uuidv4();
    let baseData = {
      grant_type: "authorization_code",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: "https://my.app.com",
      code: "325797325",
      code_verifier: verifierUUID,
    };
  }

  res.status(200).json({ name: "John Doe" });
}
