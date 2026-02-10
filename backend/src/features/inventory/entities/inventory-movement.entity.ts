import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum InventoryMovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  ADJUSTMENT = 'ADJUSTMENT',
  LOSS = 'LOSS',
}

@Entity('inventory_movements')
@Index(['productoId'])
@Index(['tipo'])
@Index(['createdAt'])
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'producto_id' })
  productoId: string;

  @ManyToOne('Product', 'inventoryMovements', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'producto_id' })
  producto: any;

  @Column({
    type: 'enum',
    enum: InventoryMovementType,
  })
  tipo: InventoryMovementType;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'text', nullable: true })
  motivo: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'usuario_id' })
  usuarioId: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
