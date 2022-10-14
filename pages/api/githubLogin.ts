import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CLIENT_ID, REDIRECT_URI } from "../../config";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { code } = request.query;

  console.log(request.query);

  try {
    const body = {
      code,
      client_id: CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
    };

    console.log(body);

    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      body,
      { headers: { Accept: "application/json" } }
    );

    console.log(data);

    response.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
}
