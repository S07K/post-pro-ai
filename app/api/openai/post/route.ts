import { ENDPOINT } from '@/app/lib/utils';
import axios from 'axios';

export const POST = async (req: Request, res: Response) => {
    const payload = await req.json();
    try {
        const response = await axios.post(`${ENDPOINT}/openai/createPost`, payload);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling create openai post api: ', error);
        return new Response(JSON.stringify(error));
    }
}