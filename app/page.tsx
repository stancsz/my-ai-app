"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { parse } from 'marked';

const App: React.FC = () => {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<Array<{ sender: string, message: string }>>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setChatHistory([{ sender: 'bot', message: 'Hello! I am here to assist you with any inquiries you have. I can provide information, help with tasks, and more. Looking forward to helping you!' }]);
    }, []);

    const handleSendMessage = async () => {
        if (!userMessage) {
            console.warn('User message is empty.');
            return;
        }

        setLoading(true);
        setChatHistory((prevChatHistory) => [...prevChatHistory, { sender: 'user', message: userMessage }]);

        try {
            const response = await axios.post('/api/generateContent', { userMessage }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data && response.data.candidates && response.data.candidates.length > 0) {
                setChatHistory((prevChatHistory) => [
                    ...prevChatHistory,
                    { sender: 'bot', message: response.data.candidates[0].content.parts[0].text }
                ]);
            } else {
                console.warn('No candidates received from the API.');
            }
            setUserMessage('');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h3>Google Gemini Chat</h3>
                </div>
                <div className="card-body">
                    <div className="mt-4">
                        <h5>Chat History</h5>
                        <ul className="list-group">
                            {chatHistory.map((chat, index) => (
                                <li key={index} className={`list-group-item ${chat.sender === 'bot' ? 'list-group-item-secondary' : ''}`} dangerouslySetInnerHTML={{ __html: parse(chat.message) }} />
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Your Message</label>
                        <input type="text" className="form-control" id="message" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyPress={handleKeyPress} />
                    </div>
                    <button className="btn btn-primary" onClick={handleSendMessage} disabled={loading}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default App;
