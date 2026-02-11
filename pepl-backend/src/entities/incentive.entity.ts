import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { Company } from './company.entity';

@Entity('incentives')
export class Incentive {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    employee: Employee;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    company: Company;

    @Column()
    month: number;

    @Column()
    year: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalIncentive: number;

    @Column({ default: 'pending' })
    status: string; // pending, approved, paid

    @Column({ type: 'jsonb', nullable: true })
    breakdown: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
