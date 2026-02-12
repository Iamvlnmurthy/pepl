import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { WebhookController } from './webhook.controller';
import { Employee, Company, Group, Department, Role } from '../entities';

@Module({
    imports: [TypeOrmModule.forFeature([Employee, Company, Group, Department, Role])],
    controllers: [WebhookController],
    providers: [SyncService],
    exports: [SyncService],
})
export class AuthModule { }
