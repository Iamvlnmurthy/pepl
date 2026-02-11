import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ClerkUser } from '../auth/clerk-user.decorator';

@Controller('attendance')
@UseGuards(ClerkAuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('check-in')
    checkIn(@Body() body: { employeeId: string; companyId: string; location: any }) {
        return this.attendanceService.checkIn(body.employeeId, body.companyId, body.location);
    }

    @Post('check-out/:id')
    checkOut(@Param('id') id: string, @Body() body: { location: any }) {
        return this.attendanceService.checkOut(id, body.location);
    }

    @Get('monthly/:employeeId')
    getMonthly(
        @Param('employeeId') employeeId: string,
        @Query('month') month: number,
        @Query('year') year: number,
    ) {
        return this.attendanceService.getMonthlyAttendance(employeeId, month, year);
    }

    @Get('me')
    getMeMonthly(
        @ClerkUser() user: any,
        @Query('month') month: number,
        @Query('year') year: number,
    ) {
        // In a real app, we'd map Clerk ID to our internal Employee ID
        return this.attendanceService.getMonthlyAttendance(user.id, month, year);
    }
}
