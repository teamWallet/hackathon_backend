// import moment from 'moment';
import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('likes')
@Index(['name', 'likesID'], { unique: true })
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  likesID: string;

  // posts task proposal
  @Column()
  type: string;

  // @CreateDateColumn({
  //   transformer: {
  //     from: (date: Date) => {
  //       return moment(date).format('YYYY-MM-DD HH:mm:ss');
  //     },
  //     to: () => {
  //       return new Date();
  //     },
  //   },
  // })
  // updateAt: string;
  @CreateDateColumn({
    type: 'timestamp'
  })
  createAt: number;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  updatedAt: number;
}
