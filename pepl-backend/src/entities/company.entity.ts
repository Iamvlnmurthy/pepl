import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { Group } from './group.entity';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Group, { onDelete: 'CASCADE' })
    group: Group;

    @Column()
    name: string;

    @Column()
    legalName: string;

    @Column({ unique: true })
    code: string;

    @Column({ nullable: true })
    gstin: string;

    @Column({ nullable: true })
    pan: string;

    @Column({ nullable: true })
    tan: string;

    @Column()
    registeredAddress: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    pincode: string;

    @Column({ default: 'India' })
    country: string;

    @Column({ type: 'jsonb', nullable: true })
    settings: any;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
