import { ErrorCode } from "./error-code";
import { DomainError } from "./domain-error";

export class InvalidPokemonAttributesError extends DomainError {
    constructor(message: string) {
        super(message, ErrorCode.INVALID_ATTRIBUTES);
        this.name = 'InvalidPokemonAttributesError';
    }
}