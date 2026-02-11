import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { SalesData } from '../entities/sales-data.entity';
import { Incentive } from '../entities/incentive.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SalesData, Incentive])],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule { }
