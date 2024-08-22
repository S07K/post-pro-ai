import { cookies } from "next/headers";

export const POST = async (req: Request, res: Response) => {
    try {
        cookies().delete("postproai-token");
        return new Response(JSON.stringify({status: "success"}));
    } catch (error: any) {
        console.error('Error calling create user api: ', error);
        return new Response(JSON.stringify(error));
    }
}