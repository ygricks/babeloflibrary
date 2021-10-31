import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Book {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  iban: string;

  @Column({type:'date'})
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}