import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryNotesController } from './delivery-notes.controller';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNote } from './entities/delivery-note.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryNote])],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService, PaginationService],
  exports: [DeliveryNotesService],
})
export class DeliveryNotesModule {}
