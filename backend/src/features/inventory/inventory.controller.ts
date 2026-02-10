import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { InventoryMovement } from './entities/inventory-movement.entity';

@ApiTags('Inventory')
@Controller('inventory')
@UseInterceptors(ClassSerializerInterceptor)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiOperation({ summary: 'Obtener todos los movimientos de inventario' })
  @Get()
  async findAll(): Promise<InventoryMovement[]> {
    return this.inventoryService.findAll();
  }

  @ApiOperation({ summary: 'Obtener movimiento por ID' })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<InventoryMovement> {
    return this.inventoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener movimientos de un producto' })
  @Get('producto/:productoId')
  async findByProducto(
    @Param('productoId', new ParseUUIDPipe()) productoId: string,
  ): Promise<InventoryMovement[]> {
    return this.inventoryService.findByProducto(productoId);
  }

  @ApiOperation({ summary: 'Registrar entrada de inventario' })
  @Post('entrada')
  async recordEntry(
    @Body() body: {
      productoId: string;
      cantidad: number;
      motivo: string;
      usuarioId?: string;
    },
  ): Promise<InventoryMovement> {
    return this.inventoryService.recordEntry(
      body.productoId,
      body.cantidad,
      body.motivo,
      body.usuarioId,
    );
  }

  @ApiOperation({ summary: 'Registrar salida de inventario' })
  @Post('salida')
  async recordExit(
    @Body() body: {
      productoId: string;
      cantidad: number;
      motivo: string;
      usuarioId?: string;
    },
  ): Promise<InventoryMovement> {
    return this.inventoryService.recordExit(
      body.productoId,
      body.cantidad,
      body.motivo,
      body.usuarioId,
    );
  }

  @ApiOperation({ summary: 'Registrar ajuste de inventario' })
  @Post('ajuste')
  async recordAdjustment(
    @Body() body: {
      productoId: string;
      cantidad: number;
      motivo: string;
      usuarioId?: string;
    },
  ): Promise<InventoryMovement> {
    return this.inventoryService.recordAdjustment(
      body.productoId,
      body.cantidad,
      body.motivo,
      body.usuarioId,
    );
  }
}
