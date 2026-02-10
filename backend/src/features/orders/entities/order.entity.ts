import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { DeliveryNote } from '../../delivery-notes/entities/delivery-note.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
@Index(['estado'])
@Index(['createdAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'numero_orden' })
  numeroOrden: string;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  estado: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'monto_total' })
  montoTotal: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'domicilio_entrega' })
  domicilioEntrega: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => DeliveryNote, (note) => note.pedido)
  deliveryNotes: DeliveryNote[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
