import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('sales')
@UseGuards(ClerkAuthGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post('record')
    addRecord(@Body() body: { employeeId: string; companyId: string; data: any }) {
        return this.salesService.addSalesRecord(body.employeeId, body.companyId, body.data);
    }

    @Get('employee/:id')
    getEmployeeSales(@Param('id') id: string) {
        return this.salesService.getEmployeeSales(id);
    }

    @Post('calculate-incentive')
    calculate(@Body() body: { employeeId: string; month: number; year: number }) {
        return this.salesService.calculateIncentive(body.employeeId, body.month, body.year);
    }
}
