import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { Company } from './company.entity';

@Entity('sales_data')
export class SalesData {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    employee: Employee;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    company: Company;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    targetAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    achievedAmount: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    achievementPercentage: number;

    @Column({ type: 'jsonb', nullable: true })
    details: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
