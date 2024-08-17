import { ENDPOINT } from "@/app/lib/utils";
import axios from "axios";

export const GET = async (req: Request, { params }: { params: { id: string }}) => {
    try {
        const id = params.id;
        const response = await axios.get(`${ENDPOINT}/projects/${id}`);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling create project api: ', error);
        return new Response(JSON.stringify(error));
    }
}

export const PUT = async (req: Request, { params }: { params: { id: string }}) => {
    try {
        const id = params.id;
        const payload = await req.json()
        const response = await axios.put(`${ENDPOINT}/projects/${id}`, payload);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling create project api: ', error);
        return new Response(JSON.stringify(error));
    }
}

export const DELETE = async (req: Request, { params }: { params: { id: string }}) => {
    try {
        const id = params.id;
        const response = await axios.delete(`${ENDPOINT}/projects/${id}`);
        return new Response(JSON.stringify(response.data));
    } catch (error: any) {
        console.error('Error calling create project api: ', error);
        return new Response(JSON.stringify(error));
    }
}