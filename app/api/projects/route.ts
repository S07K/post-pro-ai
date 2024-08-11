import { ENDPOINT } from '@/app/lib/utils';
import axios from 'axios';

export const GET = async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${ENDPOINT}/projects/getAllProjects`);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling get all project api: ', error);
        return new Response(JSON.stringify(error));
    }
}
export const POST = async (req: Request, res: Response) => {
    try {
        const payload = await req.json()
        const response = await axios.post(`${ENDPOINT}/projects/create`, payload);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling create project api: ', error);
        return new Response(JSON.stringify(error));
    }
}