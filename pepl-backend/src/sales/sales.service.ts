import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesData } from '../entities/sales-data.entity';
import { Incentive } from '../entities/incentive.entity';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(SalesData)
        private salesRepository: Repository<SalesData>,
        @InjectRepository(Incentive)
        private incentiveRepository: Repository<Incentive>,
    ) { }

    async addSalesRecord(employeeId: string, companyId: string, data: any): Promise<SalesData> {
        const record = this.salesRepository.create({
            ...data,
            employee: { id: employeeId },
            company: { id: companyId },
            achievementPercentage: (data.achievedAmount / data.targetAmount) * 100,
        } as any);
        return this.salesRepository.save(record as any);
    }

    async getEmployeeSales(employeeId: string): Promise<SalesData[]> {
        return this.salesRepository.find({
            where: { employee: { id: employeeId } },
            order: { date: 'DESC' },
        });
    }

    async calculateIncentive(employeeId: string, month: number, year: number): Promise<Incentive> {
        // Basic formula: 5% of achieved amount if > 100% target, else 2%
        const records = await this.salesRepository.find({
            where: { employee: { id: employeeId } },
        });

        // Filter by month/year (simplified for now)
        const totalAchieved = records.reduce((sum, r) => sum + Number(r.achievedAmount), 0);
        const totalTarget = records.reduce((sum, r) => sum + Number(r.targetAmount), 0);

        const percentage = (totalAchieved / totalTarget) * 100;
        const incentiveAmount = percentage >= 100 ? totalAchieved * 0.05 : totalAchieved * 0.02;

        const incentive = (this.incentiveRepository.create({
            employee: { id: employeeId },
            company: { id: records[0]?.company?.id },
            month,
            year,
            totalIncentive: incentiveAmount,
            status: 'pending',
            breakdown: { totalAchieved, totalTarget, percentage },
        } as any) as unknown) as Incentive;

        return this.incentiveRepository.save(incentive);
    }
}
