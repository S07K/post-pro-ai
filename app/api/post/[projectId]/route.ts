import { ENDPOINT } from '@/app/lib/utils';
import axios from 'axios';

export const GET = async (req: Request, { params }: { params: { projectId: string }}) => {
    try {
        const id = params.projectId;
        console.log('path: ', `${ENDPOINT}/getAllPosts/${id}`);
        const response = await axios.get(`${ENDPOINT}/post/getAllPosts/${id}`);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling get all posts api: ', error);
        return new Response(JSON.stringify(error));
    }
}