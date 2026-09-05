import { ErrorCode } from "./error-code";

export class DomainError extends Error{
    public readonly code: ErrorCode;
    
    constructor(message: string, code: ErrorCode) {
        super(message);
        this.code = code;
        this.name = 'DomainError'
    };
}