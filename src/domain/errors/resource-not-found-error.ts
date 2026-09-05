import { ErrorCode } from "./error-code";
import { DomainError } from "./domain-error";

export class ResourceNotFoundError extends DomainError {
    constructor(message: string) {
        super(message, ErrorCode.RESOURCE_NOT_FOUND);
        this.name = 'ResourceNotFoundError';
    }
}