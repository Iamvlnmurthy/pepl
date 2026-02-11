import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        } else {
            this.logger.error('GEMINI_API_KEY is not configured');
        }
    }

    async getAttritionRiskAnalysis(employeeData: any) {
        if (!this.model) return { error: 'AI model not initialized' };

        const prompt = `
      Analyze the following employee attendance and performance data for attrition risk:
      ${JSON.stringify(employeeData)}
      
      Provide a risk score (0-100) and 3 bullet points for reasons.
      Format: JSON { "score": number, "reasons": string[] }
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text().replace(/```json|```/g, ''));
        } catch (error) {
            this.logger.error('Failed to generate AI insights', error);
            return { score: 50, reasons: ['Unable to calculate due to system error'] };
        }
    }

    async getSalesIncentiveForecast(salesData: any) {
        if (!this.model) return { error: 'AI model not initialized' };

        const prompt = `
      Predict sales incentive trends based on current performance:
      ${JSON.stringify(salesData)}
      
      Suggest 2 operational improvements to boost conversion.
      Format: JSON { "forecast": string, "suggestions": string[] }
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text().replace(/```json|```/g, ''));
        } catch (error) {
            this.logger.error('Failed to generate AI sales forecast', error);
            return { forecast: 'Steady', suggestions: ['Verify data points'] };
        }
    }
}
