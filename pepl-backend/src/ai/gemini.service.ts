import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async generateInsight(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini AI Error:', error);
            throw new Error('Failed to generate AI insight');
        }
    }

    async analyzeAttrition(employeeData: any): Promise<string> {
        const prompt = `Analyze the attrition risk for the following employee data and provide a risk score (0-100) and recommendations: ${JSON.stringify(employeeData)}`;
        return this.generateInsight(prompt);
    }
}
