import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { Employee } from './employee.entity';

@Entity('departments')
export class Department {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    company: Company;

    @ManyToOne(() => Department, (dept) => dept.children, { nullable: true, onDelete: 'SET NULL' })
    parent: Department;

    @OneToMany(() => Department, (dept) => dept.parent)
    children: Department[];

    @Column()
    name: string;

    @Column({ nullable: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: 1 })
    level: number;

    @Column({ nullable: true })
    path: string;

    @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
    hod: Employee;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
