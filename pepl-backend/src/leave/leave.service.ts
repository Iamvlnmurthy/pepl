import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveApplication } from '../entities/leave-application.entity';
import { LeaveType } from '../entities/leave-type.entity';

@Injectable()
export class LeaveService {
    constructor(
        @InjectRepository(LeaveApplication)
        private leaveRepository: Repository<LeaveApplication>,
        @InjectRepository(LeaveType)
        private leaveTypeRepository: Repository<LeaveType>,
    ) { }

    async findAllTypes(): Promise<LeaveType[]> {
        return this.leaveTypeRepository.find();
    }

    async applyLeave(employeeId: string, leaveTypeId: string, data: any): Promise<LeaveApplication> {
        const leave = (this.leaveRepository.create({
            ...data,
            employee: { id: employeeId },
            leaveType: { id: leaveTypeId },
            status: 'pending',
        } as any) as unknown) as LeaveApplication;
        return this.leaveRepository.save(leave);
    }

    async getEmployeeLeaves(employeeId: string): Promise<LeaveApplication[]> {
        return this.leaveRepository.find({
            where: { employee: { id: employeeId } },
            relations: ['leaveType'],
        });
    }

    async updateStatus(id: string, status: string, approverId: string): Promise<LeaveApplication> {
        const leave = await this.leaveRepository.findOneBy({ id });
        if (!leave) throw new NotFoundException('Leave application not found');

        leave.status = status;
        leave.approvedBy = { id: approverId } as any;
        leave.approvedAt = new Date();

        return this.leaveRepository.save(leave);
    }
}
