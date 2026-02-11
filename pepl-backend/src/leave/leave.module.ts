import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { LeaveApplication } from '../entities/leave-application.entity';
import { LeaveType } from '../entities/leave-type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LeaveApplication, LeaveType])],
    controllers: [LeaveController],
    providers: [LeaveService],
})
export class LeaveModule { }
