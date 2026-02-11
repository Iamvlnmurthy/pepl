import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { Company } from './company.entity';
import { Department } from './department.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    company: Company;

    @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' })
    department: Department;

    @Column()
    title: string;

    @Column({ nullable: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    jobDescription: string;

    @Column({ default: false })
    isSalesRole: boolean;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
