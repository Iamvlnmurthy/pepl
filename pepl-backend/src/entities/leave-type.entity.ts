import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Company } from './company.entity';

@Entity('leave_types')
export class LeaveType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    company: Company;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column({ default: true })
    isPaid: boolean;

    @Column({ nullable: true })
    annualQuota: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
