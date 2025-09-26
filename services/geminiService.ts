
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { Resolution } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForResolution = (resolution: Resolution): string => {
  switch (resolution) {
    case '2x':
      return 'Upscale this image to double its original resolution. Enhance details and clarity. Provide the output as a high-quality PNG.';
    case '4x':
      return 'Upscale this image to four times its original resolution (4x). Sharpen details and improve overall image quality. The output must be a high-quality PNG file.';
    case '8K':
      return 'Upscale this image to a stunning 8K resolution (7680x4320 pixels), maintaining the original aspect ratio. Focus on creating photorealistic details and textures. The final output must be a high-quality PNG.';
    default:
      throw new Error('Invalid resolution selected.');
  }
};

export const upscaleImage = async (
  base64ImageData: string,
  mimeType: string,
  resolution: Resolution
): Promise<string> => {
  try {
    const prompt = getPromptForResolution(resolution);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No upscaled image was returned from the AI. The model may have refused the request.');

  } catch (error) {
    console.error('Error upscaling image with Gemini:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to upscale image: ${error.message}`);
    }
    throw new Error('An unknown error occurred during image upscaling.');
  }
};
