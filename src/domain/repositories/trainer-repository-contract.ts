import { Trainer } from '../entities/trainer';

export interface TrainerRepositoryContract {
    create(trainer: Trainer): Promise<void>;
}