import { ENDPOINT } from '@/app/lib/utils';
import axios from 'axios';
import { cookies } from 'next/headers';

export const GET = async (req: Request, { params }: { params: { projectId: string }}) => {
    const token = cookies().get("postproai-token")?.value;
    try {
        const id = params.projectId;
        const response = await axios.get(`${ENDPOINT}/post/getAllPosts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling get all posts api: ', error);
        return new Response(JSON.stringify(error));
    }
}