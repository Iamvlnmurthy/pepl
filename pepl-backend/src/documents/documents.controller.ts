import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('documents')
@UseGuards(ClerkAuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    upload(@Body() body: any) {
        return this.documentsService.uploadDocument(body);
    }

    @Get('employee/:id')
    getEmployeeDocs(@Param('id') id: string) {
        return this.documentsService.getEmployeeDocuments(id);
    }

    @Get('company/:id')
    getCompanyDocs(@Param('id') id: string) {
        return this.documentsService.getCompanyDocuments(id);
    }
}
