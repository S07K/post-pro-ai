import { ENDPOINT } from '@/app/lib/utils';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: Request, res: Response) => {
    const token = cookies().get("postproai-token")?.value;
    try {
        const response = await axios.get(`${ENDPOINT}/projects/getAllProjects`, {
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
export const POST = async (req: Request, res: Response) => {
    const token = cookies().get("postproai-token")?.value;
    try {
        const payload = await req.json()
        const response = await axios.post(`${ENDPOINT}/projects/create`, payload, {
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