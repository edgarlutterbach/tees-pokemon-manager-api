import { Trainer } from '../../domain/entities/trainer';
import { TrainerRepositoryContract } from '../../domain/repositories/trainer-repository-contract';

export class InMemoryTrainerRepository implements TrainerRepositoryContract {
    private trainers: Trainer[] = [];

    async create(trainer: Trainer): Promise<void> {
        this.trainers.push(trainer);
    }
}