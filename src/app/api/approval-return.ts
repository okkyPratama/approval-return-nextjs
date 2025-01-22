import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'})
    }

    try {
        const response = await axios.post('http://approval-return-publisher-kafka-java-dev.apps.ocp4dev.muf.co.id/getApprovalReturn',
            req.body
        )
        
        return res.status(200).json(response.data)
    } catch (error) {
        console.error('Error', error)
        return res.status(500).json({message: 'Internal server error'})
    }    
}