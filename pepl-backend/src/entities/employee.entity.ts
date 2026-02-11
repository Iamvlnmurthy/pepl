import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { Department } from './department.entity';
import { Role } from './role.entity';
import { Group } from './group.entity';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Group)
    group: Group;

    @ManyToOne(() => Company)
    company: Company;

    @ManyToOne(() => Department, { nullable: true })
    department: Department;

    @ManyToOne(() => Role, { nullable: true })
    role: Role;

    @Column({ unique: true })
    employeeCode: string;

    @Column()
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ unique: true })
    personalEmail: string;

    @Column({ unique: true, nullable: true })
    workEmail: string;

    @Column({ unique: true, nullable: true })
    phone: string;

    @Column({ unique: true, nullable: true })
    clerkId: string;

    @Column({ nullable: true })
    profilePicture: string;

    @Column()
    joiningDate: Date;

    @Column({ default: 'active' })
    status: string;

    @Column({ select: false, nullable: true })
    passwordHash: string;

    @ManyToOne(() => Employee, { nullable: true })
    reportingManager: Employee;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
