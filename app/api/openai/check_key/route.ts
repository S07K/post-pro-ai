import axios from 'axios';
import { ENDPOINT } from '@/app/lib/utils';
import { cookies } from 'next/headers';

export const POST = async (req: Request, res: Response) => {
    const token = cookies().get("postproai-token")?.value;
    try {
        const payload = await req.json()
        const response = await axios.post(`${ENDPOINT}/openai/check_key`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling check_key api: ', error);
        return new Response(JSON.stringify(error));
    }
}