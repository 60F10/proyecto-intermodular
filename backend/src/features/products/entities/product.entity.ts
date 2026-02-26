import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

export enum ProductType {
  INGREDIENT = 'INGREDIENT',
  MATERIAL = 'MATERIAL',
}

@Entity('products')
@Index(['code'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'enum', enum: ProductType, name: 'product_type' })
  productType: ProductType;

  @Column({ type: 'varchar', length: 30, name: 'unit_type' })
  unitType: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column({ type: 'uuid', name: 'supplier_id' })
  supplierId: string;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'yield_percent', nullable: true })
  yieldPercent: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  relation: number | null;

  @Column({ type: 'date', name: 'expires_at', nullable: true })
  expiresAt: string | null;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations — required by order-item.entity.ts and inventory-movement.entity.ts
  @OneToMany('OrderItem', 'producto')
  orderItems: any[];

  @OneToMany('InventoryMovement', 'producto')
  inventoryMovements: any[];
}
