import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollRun, SalaryStructure, Employee, Company } from '../entities';

@Injectable()
export class PayrollService {
    constructor(
        @InjectRepository(PayrollRun)
        private payrollRepository: Repository<PayrollRun>,
        @InjectRepository(SalaryStructure)
        private salaryStructureRepository: Repository<SalaryStructure>,
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    ) { }

    async calculateMonthlySalary(employeeId: string, month: number, year: number) {
        const structure = await this.salaryStructureRepository.findOne({
            where: { employee: { id: employeeId }, isActive: true },
            relations: ['employee', 'company'],
        });

        if (!structure) {
            throw new NotFoundException(`Salary structure not found for employee ${employeeId}`);
        }

        // Basic calculation logic
        const gross = Number(structure.basic) + Number(structure.hra) + Number(structure.conveyance) +
            Number(structure.medical) + Number(structure.specialAllowance);

        const deductions = Number(structure.pfEmployee) + Number(structure.esiEmployee) + Number(structure.pt);

        const net = gross - deductions;

        return {
            employeeId,
            name: structure.employee.firstName + ' ' + structure.employee.lastName,
            month,
            year,
            gross,
            deductions,
            net,
            breakdown: {
                basic: structure.basic,
                hra: structure.hra,
                pf: structure.pfEmployee,
                esi: structure.esiEmployee,
                pt: structure.pt,
            }
        };
    }

    async processPayroll(companyId: string, month: number, year: number) {
        const employees = await this.employeeRepository.find({
            where: { company: { id: companyId } }
        });

        const results: any[] = [];
        let totalPayout = 0;

        for (const employee of employees) {
            try {
                const salary = await this.calculateMonthlySalary(employee.id, month, year);
                results.push(salary);
                totalPayout += Number(salary.net);
            } catch (e) {
                // Skip employees without structure or handle error
            }
        }

        const run = this.payrollRepository.create({
            company: { id: companyId } as any,
            month,
            year,
            totalPayout,
            status: 'processed',
            stats: {
                headCount: results.length,
                totalGross: results.reduce((sum, r) => sum + Number(r.gross), 0),
                totalDeductions: results.reduce((sum, r) => sum + Number(r.deductions), 0),
            } as any
        } as any);

        return this.payrollRepository.save(run);
    }

    async getPayrollHistory(companyId: string) {
        return this.payrollRepository.find({
            where: { company: { id: companyId } },
            order: { year: 'DESC', month: 'DESC' }
        });
    }
}
