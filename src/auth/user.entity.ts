import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { hash } from 'bcrypt';
import { Task } from 'src/task/task.entity';
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  taskList: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await hash(password, this.salt);
    return hashPassword === this.password;
  }
}
