import { PartialType } from '@nestjs/swagger';
import { CreateIncidentDto } from './create-incident.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IncidentStatus } from '../entities/incident.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @ApiProperty({
    enum: IncidentStatus,
    required: false,
    description: 'Estado del incidente',
  })
  @IsEnum(IncidentStatus)
  @IsOptional()
  estado?: IncidentStatus;

  @ApiProperty({
    example: 'Se reemplazó el producto',
    description: 'Resolución del incidente',
    required: false,
  })
  @IsString()
  @IsOptional()
  resolucion?: string;
}
