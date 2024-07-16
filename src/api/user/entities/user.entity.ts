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
  name: 'users',
  // orderBy: {
  //   email: 'ASC',
  // },
})

@Unique(['id'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'first_name', nullable: true, length: 52 })
  first_name?: string;

  @Column('varchar', { name: 'last_name', nullable: true, length: 52 })
  last_name?: string;

  @Column('varchar', { name: 'email', nullable: true, length: 52 })
  email?: string;

  @Column('varchar', { name: 'password', length: 255 })
  password?: string;

  @Column('boolean', { name: 'status', nullable: true, default: true })
  status?: boolean;

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
