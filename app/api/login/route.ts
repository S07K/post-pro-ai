import { ENDPOINT } from "@/app/lib/utils";
import axios from "axios";
import { cookies } from "next/headers";

export const POST = async (req: Request, res: Response) => {
    try {
        const payload = await req.json()
        const response = await axios.post(`${ENDPOINT}/user/login`, payload);
        if(response.data.status === "success") {
            //set token in cookie
            // console.log('setting token in cookie: ', response.data.token);
            if(response.data.token) {
                cookies().set("postproai-token", response.data.token)
                return new Response(JSON.stringify({status: "success", token: response.data.token}));
            }
        } else {
            console.error('Error calling login api: ', response.data.message);
            return new Response(JSON.stringify({status: "error", message: response.data.message}));
        }
    } catch (error: any) {
        console.error('Error calling create user api: ', error);
        return new Response(JSON.stringify(error));
    }
}