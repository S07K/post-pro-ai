import { ENDPOINT } from "@/app/lib/utils";
import axios from "axios";
import { cookies } from "next/headers";

export const GET = async (req: Request, res: Response) => {
    const token = cookies().get("postproai-token")?.value;
    try {
        const response = await axios.get(`${ENDPOINT}/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(response.data.status === "success") {
            return new Response(JSON.stringify(response.data));
        } else {
            console.error('Error calling get all project api: ', response.data.message);
            return new Response(JSON.stringify(response.data));
        }
    } catch (error: any) {
        console.error('Error calling get all project api: ', error);
        return new Response(JSON.stringify(error));
    }
}