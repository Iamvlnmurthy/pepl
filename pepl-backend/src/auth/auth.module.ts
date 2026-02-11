import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { WebhookController } from './webhook.controller';
import { Employee, Company } from '../entities';

@Module({
    imports: [TypeOrmModule.forFeature([Employee, Company])],
    controllers: [WebhookController],
    providers: [SyncService],
    exports: [SyncService],
})
export class AuthModule { }
