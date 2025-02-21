import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: string;
    @Column({ length: 80 })
    name!: string;
    @Column({ type: 'date', nullable: true })
    startDate?: Date;
    @Column({ type: 'date', nullable: true })
    endDate?: Date;
}
