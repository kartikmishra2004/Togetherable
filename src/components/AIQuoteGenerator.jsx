import React, { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const AIQuoteGenerator = () => {

    const [quote, setQuote] = useState('')
    const [quoteLoading, setQuoteLoading] = useState(false);

    useEffect(() => {
        generateQuote();
    }, [])

    const generateQuote = async () => {
        setQuoteLoading(true);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent("write a motivational quote (not more than 150 characters) for the people who has speech and hearing imparements. (Do not add double quotes)");
        const response = result.response;
        setQuote(response.text())
        setQuoteLoading(false);
    }
    return (
        <div className={`text-primary font-main lg:p-10 lg:text-base text-xs rounded-2xl shadow-xl lg:max-w-2xl w-full`}>
            {quoteLoading ? '' : (
                <div className="mb-8">
                    <div className="text-2xl md:text-3xl text-center mb-4 leading-relaxed">
                        <span className="text-4xl text-main font-serif">"</span>
                        {quote}
                        <span className="text-4xl text-main font-serif">"</span>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default AIQuoteGenerator