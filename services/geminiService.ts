
import { GoogleGenAI, FunctionDeclaration, Type, GenerateContentResponse } from "@google/genai";
import { Habit } from '../types';

const tools: { functionDeclarations: FunctionDeclaration[] }[] = [
    {
        functionDeclarations: [
            {
                name: "add_habit",
                description: "Adds a new habit to the habit tracker.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the habit to track." },
                    },
                    required: ["name"],
                },
            },
            {
                name: "log_habit_completion",
                description: "Logs a habit as completed for a specific date.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the habit." },
                        date: { type: Type.STRING, description: "The date of completion in YYYY-MM-DD format. Defaults to today if not provided." },
                    },
                    required: ["name"],
                },
            },
            {
                name: "add_habit_note",
                description: "Adds a note to the habit tracker section.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        note: { type: Type.STRING, description: "The note content to add." },
                    },
                    required: ["note"],
                },
            },
            {
                name: "set_monthly_reflection",
                description: "Sets the end-of-month reflection for the habit tracker.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        reflection: { type: Type.STRING, description: "The reflection text." },
                    },
                    required: ["reflection"],
                },
            },
        ],
    },
];

export const processUserCommand = async (
    prompt: string,
    habits: Habit[],
    habitNotes: string,
    monthlyReflection: string
): Promise<{ responseText: string; functionCall?: any }> => {
    if (!process.env.API_KEY) {
        return { responseText: "API Key not configured. Please set your API key." };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const fullContextPrompt = `
User query: "${prompt}"

Current state:
- Today's Date: ${new Date().toISOString().split('T')[0]}
- Habits: ${JSON.stringify(habits)}
- Habit Notes: ${habitNotes}
- Monthly Reflection: ${monthlyReflection}

Based on the user's query and the current state, decide if a function should be called. If so, call the appropriate function with the correct arguments. Otherwise, provide a helpful text response.
`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: fullContextPrompt }] }],
            config: {
                tools,
            },
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            return {
                responseText: `Executing action: ${response.functionCalls[0].name}`,
                functionCall: response.functionCalls[0],
            };
        }

        return { responseText: response.text };
    } catch (error) {
        console.error("Error processing user command:", error);
        return { responseText: "Sorry, I encountered an error. It might be related to your API key. Please try again." };
    }
};