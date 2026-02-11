import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { Company } from './company.entity';

@Entity('attendance')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    employee: Employee;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    company: Company;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'timestamptz', nullable: true })
    checkIn: Date;

    @Column({ type: 'timestamptz', nullable: true })
    checkOut: Date;

    @Column({ type: 'jsonb', nullable: true })
    checkInLocation: any;

    @Column({ type: 'jsonb', nullable: true })
    checkOutLocation: any;

    @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
    workHours: number;

    @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
    overtimeHours: number;

    @Column({ default: 'pending' })
    status: string;

    @Column({ default: false })
    isLate: boolean;

    @Column({ default: false })
    isLocked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
