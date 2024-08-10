import axios from 'axios';
import { ENDPOINT } from '@/app/lib/utils';

export const POST = async (req: Request, res: Response) => {
    try {
        const payload = await req.json()
        const response = await axios.post(`${ENDPOINT}/openai/check_key`, payload);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling check_key api: ', error);
        return new Response(JSON.stringify(error));
    }
}