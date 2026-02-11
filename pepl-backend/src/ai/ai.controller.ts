import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('ai')
@UseGuards(ClerkAuthGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Get('attrition-risk')
    getAttritionRisk(@Query('employeeId') employeeId: string) {
        // Mock data for now, ideally fetched from attendance/performance services
        const mockData = {
            attendanceRate: 85,
            leavesTaken: 3,
            lateArrivals: 5,
            tenureMonths: 14,
        };
        return this.aiService.getAttritionRiskAnalysis(mockData);
    }

    @Get('sales-forecast')
    getSalesForecast(@Query('companyId') companyId: string) {
        const mockSales = {
            currentRevenue: 500000,
            targetRevenue: 600000,
            openDeals: 12,
            conversionRate: 0.25,
        };
        return this.aiService.getSalesIncentiveForecast(mockSales);
    }
}
