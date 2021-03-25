export class ValidatedResponse<T> {
    success: boolean;
    errorCount: number;
    validationErrors: ErrorDescriptor[];
    value: T;
    warnings: string[];
}

export class ErrorDescriptor {
    fieldName: string;
    code: string;
    arguments: {[key: string]: any};
}
