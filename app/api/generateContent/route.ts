import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const apiKey = process.env.GOOGLE_API_KEY;

export async function POST(req: NextRequest) {
    if (!apiKey) {
        return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    try {
        const { userMessage } = await req.json();

        if (!userMessage) {
            return NextResponse.json({ error: 'User message is missing' }, { status: 400 });
        }

        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
            contents: [{ parts: [{ text: userMessage }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
