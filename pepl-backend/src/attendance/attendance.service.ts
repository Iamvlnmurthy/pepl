import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
    ) { }

    async checkIn(employeeId: string, companyId: string, location: any): Promise<Attendance> {
        const today = new Date().toISOString().split('T')[0];
        const attendance = this.attendanceRepository.create({
            employee: { id: employeeId },
            company: { id: companyId },
            date: today,
            checkIn: new Date(),
            checkInLocation: location,
            status: 'present',
        });
        return this.attendanceRepository.save(attendance);
    }

    async checkOut(id: string, location: any): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOneBy({ id });
        if (!attendance) throw new Error('Attendance record not found');

        attendance.checkOut = new Date();
        attendance.checkOutLocation = location;

        // Calculate hours
        const diff = attendance.checkOut.getTime() - attendance.checkIn.getTime();
        attendance.workHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));

        return this.attendanceRepository.save(attendance);
    }

    async getMonthlyAttendance(employeeId: string, month: number, year: number): Promise<Attendance[]> {
        // Basic implementation
        return this.attendanceRepository.find({
            where: { employee: { id: employeeId } },
            order: { date: 'DESC' },
        });
    }
}
