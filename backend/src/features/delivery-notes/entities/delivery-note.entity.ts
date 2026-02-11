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

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

@Entity('delivery_notes')
@Index(['numeroRemito'], { unique: true })
@Index(['estado'])
export class DeliveryNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'numero_remito' })
  numeroRemito: string;

  @Column({ type: 'uuid', name: 'pedido_id' })
  pedidoId: string;

  @ManyToOne('Order', 'deliveryNotes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido: any;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  estado: DeliveryStatus;

  @Column({ type: 'varchar', length: 255 })
  transportista: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'numero_tracking' })
  numeroTracking: string | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'fecha_entrega' })
  fechaEntrega: Date | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
