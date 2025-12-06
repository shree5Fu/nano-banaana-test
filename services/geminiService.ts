import { GoogleGenAI } from "@google/genai";
import { EditRequest } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to strip the data:image/...;base64, prefix
const cleanBase64 = (base64Data: string): string => {
  const parts = base64Data.split(',');
  return parts.length > 1 ? parts[1] : parts[0];
};

export const generateEditedImage = async (request: EditRequest): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Mapped from "Nano Banana"
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64(request.image.base64),
              mimeType: request.image.mimeType,
            },
          },
          {
            text: request.prompt,
          },
        ],
      },
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image was returned by the model.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("Failed to edit image due to an unknown error.");
  }
};