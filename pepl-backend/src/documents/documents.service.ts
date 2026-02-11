import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentRecord, Employee, Company } from '../entities';

@Injectable()
export class DocumentsService {
    private readonly logger = new Logger(DocumentsService.name);

    constructor(
        @InjectRepository(DocumentRecord)
        private documentRepository: Repository<DocumentRecord>,
    ) { }

    async uploadDocument(data: { name: string; type: string; url: string; employeeId: string; companyId: string }) {
        this.logger.log(`Uploading document: ${data.name} for employee ${data.employeeId}`);

        const doc = this.documentRepository.create({
            name: data.name,
            type: data.type,
            url: data.url,
            employee: { id: data.employeeId } as any,
            company: { id: data.companyId } as any,
            status: 'verified', // Auto-verify for now
        });

        return this.documentRepository.save(doc);
    }

    async getEmployeeDocuments(employeeId: string) {
        return this.documentRepository.find({
            where: { employee: { id: employeeId } },
            order: { createdAt: 'DESC' },
        });
    }

    async getCompanyDocuments(companyId: string) {
        return this.documentRepository.find({
            where: { company: { id: companyId } },
            relations: ['employee'],
            order: { createdAt: 'DESC' },
        });
    }
}
