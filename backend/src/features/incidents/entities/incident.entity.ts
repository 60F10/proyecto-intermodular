import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum IncidentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

@Entity('incidents')
@Index(['estado'])
@Index(['prioridad'])
@Index(['createdAt'])
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: IncidentPriority,
    default: IncidentPriority.MEDIUM,
  })
  prioridad: IncidentPriority;

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.OPEN,
  })
  estado: IncidentStatus;

  @Column({ type: 'uuid' })
  pedidoId: string;

  @Column({ type: 'uuid' })
  usuarioId: string;

  @Column({ type: 'text', nullable: true })
  resolucion: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
