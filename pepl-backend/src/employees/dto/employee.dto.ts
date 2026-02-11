import { IsString, IsEmail, IsNotEmpty, IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';

export class CreateEmployeeDto {
    @IsUUID()
    companyId: string;

    @IsUUID()
    @IsOptional()
    departmentId?: string;

    @IsUUID()
    @IsOptional()
    roleId?: string;

    @IsString()
    @IsNotEmpty()
    employeeCode: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail()
    personalEmail: string;

    @IsEmail()
    @IsOptional()
    workEmail?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsDateString()
    joiningDate: string;

    @IsString()
    @IsOptional()
    @IsEnum(['active', 'on_notice', 'on_leave', 'suspended', 'exited'])
    status?: string;

    @IsUUID()
    @IsOptional()
    reportingManagerId?: string;
}

export class UpdateEmployeeDto extends CreateEmployeeDto { }
