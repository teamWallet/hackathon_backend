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

//TODO index
@Entity('profile')
export class Profile {
  @PrimaryColumn()
  name: string;
  // @Column({ default: '' })
  // mobile: string;
  @Column({ default: '' })
  avatar: string;
  @Column({ default: '' })
  nickName: string;
  @Column({ default: '' })
  gender: string;
  @Column({ default: '' })
  address: string;
  @Column({ default: '' })
  birthday: string;
  @Column({ default: '' })
  profile: string;
  @Column({ default: '' })
  qrCode: string;

  @UpdateDateColumn({
    transformer: {
      from: (date: Date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      to: () => {
        return new Date();
      },
    },
  })
  updatedAt: string;
}
