import { ENDPOINT } from "@/app/lib/utils";
import axios from "axios";

export const POST = async (req: Request, res: Response) => {
    try {
        const payload = await req.json()
        const response = await axios.post(`${ENDPOINT}/user/create`, payload);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling create user api: ', error);
        return new Response(JSON.stringify(error));
    }
}