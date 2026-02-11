import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { Company } from './company.entity';

@Entity('salary_structures')
export class SalaryStructure {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Employee)
    @JoinColumn()
    employee: Employee;

    @ManyToOne(() => Company)
    company: Company;

    @Column('decimal', { precision: 12, scale: 2 })
    basic: number;

    @Column('decimal', { precision: 12, scale: 2 })
    hra: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    conveyance: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    medical: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    specialAllowance: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    pfEmployee: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    pfEmployer: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    esiEmployee: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    esiEmployer: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    pt: number;

    @Column({ default: true })
    isActive: boolean;
}
