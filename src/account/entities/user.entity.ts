import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({
  //   unique: true,
  //   nullable: true,
  // })
  // feature: string;

  // @Column({
  //   unique: true,
  //   // nullable: true,
  // })
  // faceId: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    default: '',
  })
  fullname: string;
  @Column({
    unique: true,
  })
  username: string;
  @Column({
    unique: true,
  })
  password: string;
  @Column({
    default: 'https://img1.daofengdj.com/uploads/avatar/20200328/cafitc8v13zue9qt0qcdz695peqipp1j.jpeg',
  })
  photo: string;

  @Column({
    default: false,
  })
  banned: boolean;

  @CreateDateColumn({
    type: 'timestamp'
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  updatedAt: number;
}
