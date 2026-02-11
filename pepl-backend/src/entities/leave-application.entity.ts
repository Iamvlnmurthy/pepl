import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { LeaveType } from './leave-type.entity';

@Entity('leave_applications')
export class LeaveApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    employee: Employee;

    @ManyToOne(() => LeaveType, { onDelete: 'CASCADE' })
    leaveType: LeaveType;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    @Column({ type: 'decimal', precision: 4, scale: 1 })
    days: number;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @Column({ default: 'pending' })
    status: string; // pending, approved, rejected, cancelled

    @ManyToOne(() => Employee, { nullable: true })
    approvedBy: Employee;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
