// import moment from 'moment';
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
} from 'typeorm';
export enum CommentType {
  posts,
  comments,
  activites,
  goods,
}
@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;
  @PrimaryGeneratedColumn('uuid')
  commentId: string;
  @Column()
  name: string;
  @Column()
  upID: string;
  // posts,task,propsoal
  @Column()
  type: string;

  @Column('text')
  content: string;
  @Column({ default: '' })
  title: string;
  @Column({ default: '' })
  images: string;
  @Column({ default: '' })
  tag: string;
  @Column({ default: '' })
  brief: string;
  @Column('integer', { default: 0 })
  views: number;
  @Column('integer', { default: 0 })
  likes: number;
  @Column('integer', { default: 0 })
  comments: number;
  @Column('integer', { default: 0 })
  collects: number;

  @Column({ default: '' })
  reply: string;

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
  // createAt: string;
  // @UpdateDateColumn({
  //   transformer: {
  //     from: (date: Date) => {
  //       return moment(date).format('YYYY-MM-DD HH:mm:ss');
  //     },
  //     to: () => {
  //       return new Date();
  //     },
  //   },
  // })
  // updatedAt: string;
  @CreateDateColumn({
    type: 'timestamp'
  })
  createAt: number;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  updatedAt: number;
}
