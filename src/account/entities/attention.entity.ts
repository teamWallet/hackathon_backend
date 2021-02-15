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

@Entity('attentions')
@Index(['name', 'upUser'], { unique: true })
export class Attention {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  upUser: string;

  @Column({ default: '' })
  type: string;

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
  updateAt: string;
}
