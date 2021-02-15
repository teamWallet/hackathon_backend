import {
  Entity,
  Column,
  Index,
  ObjectID,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  PrimaryColumn,
  JoinTable,
} from 'typeorm';
import * as moment from 'moment';

@Entity({ name: 'financial' })
export class FinancialData {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column('bigint')
  amount: string;
  @Column()
  symbol: string;
  @Column()
  quantity: string;
}
