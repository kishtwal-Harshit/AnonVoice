import { NextRequest, NextResponse } from 'next/server';

// First, let's add some debugging and error checking
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

let genAI: any = null;

try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');  // Fixed package name
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    console.log('GoogleGenerativeAI initialized successfully');
} catch (error) {
    console.error('Error initializing GoogleGenerativeAI:', error);
}

export async function POST(request: NextRequest) {
    console.log('Suggest messages API called');
    
    // Fallback suggestions
    const fallbackSuggestions = "What's your favorite movie?||Do you have any pets?||What's your dream job?";
    
    try {
        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return NextResponse.json({
                success: true,
                suggestions: fallbackSuggestions,
                message: "Using default suggestions (API key not configured)"
            });
        }

        // Check if genAI was initialized properly
        if (!genAI) {
            console.error('GoogleGenerativeAI not initialized');
            return NextResponse.json({
                success: true,
                suggestions: fallbackSuggestions,
                message: "Using default suggestions (AI service unavailable)"
            });
        }

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        console.log('Attempting to generate content...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        //console.log('Generated text:', text);

        return NextResponse.json({
            success: true,
            suggestions: text || fallbackSuggestions,
            message: "AI suggestions generated successfully"
        });

    } catch (error: any) {
        console.error("Detailed error generating content:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause
        });
        
        // Return fallback suggestions instead of error
        return NextResponse.json({
            success: true,
            suggestions: fallbackSuggestions,
            message: "Using default suggestions (AI generation failed)"
        });
    }
}