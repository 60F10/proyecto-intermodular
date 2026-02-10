import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryNoteDto } from './create-delivery-note.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DeliveryStatus } from '../entities/delivery-note.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliveryNoteDto extends PartialType(CreateDeliveryNoteDto) {
  @ApiProperty({
    enum: DeliveryStatus,
    required: false,
    description: 'Estado de la entrega',
  })
  @IsEnum(DeliveryStatus)
  @IsOptional()
  estado?: DeliveryStatus;
}
