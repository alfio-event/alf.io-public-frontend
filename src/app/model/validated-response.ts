export class ValidatedResponse<T> {
    success: boolean;
    errorCount: number;
    validationErrors: ErrorDescriptor[];
    value: T;
}

export class ErrorDescriptor {

}