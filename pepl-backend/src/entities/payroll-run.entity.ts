import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Company } from './company.entity';
import { Employee } from './employee.entity';

@Entity('payroll_runs')
export class PayrollRun {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company)
    company: Company;

    @Column()
    month: number;

    @Column()
    year: number;

    @Column({ type: 'enum', enum: ['draft', 'processed', 'paid'], default: 'draft' })
    status: string;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    totalPayout: number;

    @Column('jsonb', { nullable: true })
    stats: any; // { headCount: number, totalBasic: number, totalDeductions: number }

    @ManyToMany(() => Employee)
    @JoinTable({ name: 'payroll_run_employees' })
    employees: Employee[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    processedAt: Date;
}
