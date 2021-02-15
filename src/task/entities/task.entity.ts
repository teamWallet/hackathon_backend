import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  taskId: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  body: string;

  @Column({
    nullable: false,
  })
  status: string;

  @Column({
    nullable: false,
  })
  neededLikes: number;

  @Column({
    nullable: false,
  })
  payment: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  executorName: string;

  @Column({
    nullable: true,
  })
  postId: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dueAt: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishAt: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: number;

  @Column({
    nullable: true,
  })
  contractId: string;

  @Column()
  contentHash: string;

  @Column()
  ownerInfo: string;

  @Column()
  executorInfo: string;

}
