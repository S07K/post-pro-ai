import { ENDPOINT } from '@/app/lib/utils';
import axios from 'axios';
import { cookies } from 'next/headers';

export const POST = async (req: Request, { params }: { params: { id: string }}) => {
    const token = cookies().get("postproai-token")?.value;
    const id = params.id;
    try {
        const payload = await req.json()
        const response = await axios.post(`${ENDPOINT}/projects/${id}/set_access`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling create project api: ', error);
        return new Response(JSON.stringify(error));
    }
}