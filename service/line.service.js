import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

const sendLineMessage = async (uid, messages) => {
    if (!uid) throw new Error('User ID is required');
    if (!process.env.TOKEN) throw new Error('LINE Token is required');

    const config = {
        method: 'post',
        url: LINE_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TOKEN}`
        },
        data: {
            to: uid,
            messages: Array.isArray(messages) ? messages : [messages]
        }
    };

    const response = await axios.request(config);
    return response.data;
};

export const replyFlex = async (uid, flexMessage) => {
    try {
        return await sendLineMessage(uid, flexMessage);
    } catch (error) {
        console.error('Flex Message Error:', error);
        throw error;
    }
};

export const replyText = async (uid, text) => {
    try {
        const message = {
            type: 'text',
            text: text || 'No message provided'
        };
        return await sendLineMessage(uid, [message]);
    } catch (error) {
        console.error('Text Message Error:', error);
        throw error;
    }
};