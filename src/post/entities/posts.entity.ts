// import moment from 'moment';
import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectID,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Authority {
  key: string;
  value: string;
}

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;
  @PrimaryGeneratedColumn('uuid')
  postId: string;
  @Column()
  name: string;

  @Column('text')
  content: string;
  @Column({ default: '' })
  title: string;
  @Column({ default: '' })
  images: string;
  @Column()
  tag: string;
  @Column({ default: '' })
  brief: string;

  @Column('integer', { default: 0 })
  views: number;

  @Column('integer', { default: 0 })
  likes: number;
  @Column('integer', { default: 0 })
  comments: number;

  // @Column('integer', { default: 0 })
  // collects: number;
  @Column('jsonb', { default: {} })
  addressInfo: string;
  // user, dac
  @Column({ default: 'user' })
  mode: string;

  @Column({ default: '' })
  type: string;
  @Column({ default: '' })
  dacId: string;
  @Column({ default: 'published' })
  status: string;
  @Column('integer', { default: 0 })
  top: number;

  // @Column('jsonb', { default: {} })
  // authority: string;
  @CreateDateColumn({
    type: 'timestamp'
  })
  createAt: number;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  updatedAt: number;
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

  @Column({
    nullable: true
  })
  authorName: string;

  @Column({
    nullable: true
  })
  authorNickName: string;

  @Column({
    nullable: true
  })
  authorAvatar: string;

  @Column({
    nullable: true
  })
  hash: string;
}
