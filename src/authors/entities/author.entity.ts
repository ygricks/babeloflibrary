import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Author {
//   @PrimaryGeneratedColumn()
//   id: number;
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({type:'date'})
  birthday: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}