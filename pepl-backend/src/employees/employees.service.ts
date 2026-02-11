import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ) { }

    async findAll(): Promise<Employee[]> {
        return this.employeesRepository.find({
            relations: ['company', 'department', 'role', 'reportingManager'],
        });
    }

    async findOne(id: string): Promise<Employee> {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['company', 'department', 'role', 'reportingManager'],
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const { companyId, departmentId, roleId, reportingManagerId, ...rest } = createEmployeeDto;
        const employee = (this.employeesRepository.create(rest as any) as unknown) as Employee;

        employee.company = { id: companyId } as any;
        if (departmentId) employee.department = { id: departmentId } as any;
        if (roleId) employee.role = { id: roleId } as any;
        if (reportingManagerId) employee.reportingManager = { id: reportingManagerId } as any;

        return this.employeesRepository.save(employee);
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        const employee = await this.findOne(id);
        const { companyId, departmentId, roleId, reportingManagerId, ...rest } = updateEmployeeDto;

        this.employeesRepository.merge(employee, rest as any);

        if (companyId) employee.company = { id: companyId } as any;
        if (departmentId) employee.department = { id: departmentId } as any;
        if (roleId) employee.role = { id: roleId } as any;
        if (reportingManagerId) employee.reportingManager = { id: reportingManagerId } as any;

        return this.employeesRepository.save(employee);
    }

    async remove(id: string): Promise<void> {
        const employee = await this.findOne(id);
        await this.employeesRepository.softRemove(employee);
    }
}
