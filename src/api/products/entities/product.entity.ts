import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({
    name: 'products',
    orderBy: {
      product_name: 'ASC',
    },
  })
  
  @Unique(['id'])
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', { name: 'category', nullable: true, length: 100 })
    category?: string;
  
    @Column('varchar', { name: 'product_name', nullable: true, length: 100 })
    product_name?: string;
  
    @Column('varchar', { name: 'description', nullable: true, length: 200 })
    description?: string;

    @Column('varchar', { name: 'image', nullable: true, length: 200 })
    image?: string;
  
    @Column('float', { name: 'price', nullable: true, default: 0 })
    price?: number;
  
    @Column('enum', { name: 'status', nullable: true, default: 'pending', enum: ['pending', 'active', 'inactive'] })
    status?: string;
  
    @Column('varchar', { name: 'created_by', nullable: true, length: 50 })
    created_by?: string;
  
    @CreateDateColumn({ name: 'created_at' })
    created_at?: string;
  
    @Column('varchar', { name: 'updated_by', nullable: true, length: 50 })
    updated_by?: string;
  
    @UpdateDateColumn({ name: 'updated_at', select: false })
    updated_at?: string;
  
    @DeleteDateColumn({ name: 'deleted_at', select: false })
    deleted_at?: string;
  
  }
  