import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { PayrollRun, SalaryStructure, Employee } from '../entities';

@Module({
    imports: [TypeOrmModule.forFeature([PayrollRun, SalaryStructure, Employee])],
    controllers: [PayrollController],
    providers: [PayrollService],
    exports: [PayrollService],
})
export class PayrollModule { }
