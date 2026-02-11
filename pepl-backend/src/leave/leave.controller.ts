import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('leave')
@UseGuards(ClerkAuthGuard)
export class LeaveController {
    constructor(private readonly leaveService: LeaveService) { }

    @Get('types')
    findAllTypes() {
        return this.leaveService.findAllTypes();
    }

    @Post('apply')
    applyLeave(@Body() body: { employeeId: string; leaveTypeId: string; data: any }) {
        return this.leaveService.applyLeave(body.employeeId, body.leaveTypeId, body.data);
    }

    @Get('employee/:id')
    getEmployeeLeaves(@Param('id') id: string) {
        return this.leaveService.getEmployeeLeaves(id);
    }

    @Patch('status/:id')
    updateStatus(
        @Param('id') id: string,
        @Body() body: { status: string; approverId: string },
    ) {
        return this.leaveService.updateStatus(id, body.status, body.approverId);
    }
}
