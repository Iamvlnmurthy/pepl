import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('payroll')
@UseGuards(ClerkAuthGuard)
export class PayrollController {
    constructor(private readonly payrollService: PayrollService) { }

    @Post('process')
    process(@Body() body: { companyId: string; month: number; year: number }) {
        return this.payrollService.processPayroll(body.companyId, body.month, body.year);
    }

    @Get('history/:companyId')
    getHistory(@Param('companyId') companyId: string) {
        return this.payrollService.getPayrollHistory(companyId);
    }

    @Get('calculate/:employeeId')
    calculate(
        @Param('employeeId') employeeId: string,
        @Query('month') month: number,
        @Query('year') year: number,
    ) {
        return this.payrollService.calculateMonthlySalary(employeeId, month, year);
    }
}
