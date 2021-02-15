import * as moment from 'moment';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  // Index,
  // ObjectID,
  // ObjectIdColumn,
  CreateDateColumn,
  // OneToOne,
  // ManyToOne,
  // ManyToOne,
  // PrimaryColumn,
  // JoinTable,
  // UpdateDateColumn,
  // JoinColumn,
  // ManyToOne,
} from 'typeorm';

@Entity({ name: 'dac_tasks' })
export class TasksData {
  @PrimaryGeneratedColumn()
  id: number;
  @PrimaryGeneratedColumn('uuid')
  // @Column('uuid')
  taskId: string;
  @Column({ default: 'daily' })
  type: string;
  // 1 doing; 2 done; 3 error; 4 reward claimed.
  @Column({ default: 1 })
  status: number;
  // 1 receive; 2 wait; 3 received; 4 error
  @Column({ default: 1 })
  receive: number;
  @Column({ default: 'everyOne' })
  executor: string;
  @Column({ default: 0 })
  executeNum: number;

  @Column({ default: '' })
  extra: string;

  @Column({
    transformer: {
      from: (date: Date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      to: () => {
        return new Date();
      },
    },
  })
  rewardAt: string;
  @CreateDateColumn({
    transformer: {
      from: (date: Date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      to: () => {
        return new Date();
      },
    },
  })
  createAt: string;
}
