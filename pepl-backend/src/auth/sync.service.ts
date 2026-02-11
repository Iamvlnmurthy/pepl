import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, Company, Department, Role } from '../entities';

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);

    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) { }

    async handleUserCreated(data: any) {
        const { id, first_name, last_name, email_addresses, image_url } = data;
        const email = email_addresses[0]?.email_address;

        this.logger.log(`Syncing new user from Clerk: ${email} (${id})`);

        // Check if employee already exists by personalEmail
        let employee: Employee | null = await this.employeeRepository.findOne({ where: { personalEmail: email } });

        if (!employee) {
            // Create new employee shell
            // In a real scenario, we might want to default them to a specific company or keep it null
            employee = (this.employeeRepository.create({
                firstName: first_name || '',
                lastName: last_name || '',
                personalEmail: email,
                clerkId: id,
                profilePicture: image_url,
                status: 'active',
                employeeCode: `EMP-${Date.now()}`,
                joiningDate: new Date(),
            } as any) as unknown) as Employee;
        } else {
            // Update existing employee with Clerk ID
            employee.clerkId = id;
            employee.profilePicture = image_url;
        }

        if (!employee) return;
        return this.employeeRepository.save(employee);
    }

    async handleUserUpdated(data: any) {
        const { id, first_name, last_name, email_addresses, image_url } = data;
        const email = email_addresses[0]?.email_address;

        const employee = await this.employeeRepository.findOne({ where: { clerkId: id } });

        if (employee) {
            employee.firstName = first_name || employee.firstName;
            employee.lastName = last_name || employee.lastName;
            employee.profilePicture = image_url || employee.profilePicture;
            return this.employeeRepository.save(employee);
        }
    }

    async handleUserDeleted(id: string) {
        const employee = await this.employeeRepository.findOne({ where: { clerkId: id } });
        if (employee) {
            employee.status = 'terminated'; // Soft delete
            return this.employeeRepository.save(employee);
        }
    }
}
