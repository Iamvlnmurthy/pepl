import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { Company } from './company.entity';

@Entity('documents')
export class DocumentRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    type: string; // 'payslip', 'id_proof', 'contract', 'other'

    @Column()
    url: string;

    @Column({ default: 'pending' })
    status: string; // 'pending', 'verified', 'rejected'

    @ManyToOne(() => Employee)
    employee: Employee;

    @ManyToOne(() => Company)
    company: Company;

    @CreateDateColumn()
    createdAt: Date;
}
