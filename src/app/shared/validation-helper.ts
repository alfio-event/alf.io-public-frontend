import { AbstractControl } from '@angular/forms';
import { ValidatedResponse, ErrorDescriptor } from '../model/validated-response';
import { HttpErrorResponse } from '@angular/common/http';



export function applyValidationErrors(form: AbstractControl, response: ValidatedResponse<any>): ErrorDescriptor[] {

    if (response.errorCount === 0) {
        return [];
    }

    const globalErrors = [];

    response.validationErrors.forEach(err => {

        //form.get('tickets[207f224c-1df6-4994-9cb2-fa12eb36882d].email') -> not ok
        //form.get('tickets.207f224c-1df6-4994-9cb2-fa12eb36882d.email')  -> ok
        const transformedFieldName = err.fieldName.replace('[', '.').replace(']', '');

        const formControl = form.get(transformedFieldName);

        if (formControl) {
            const formControlErr = formControl.getError('serverError');
            if (formControlErr) {
                (formControlErr as string[]).push(err.code); //add another error
            } else {
                formControl.setErrors({serverError: [err.code]});
            }
            formControl.markAsTouched();
        } else {
            globalErrors.push(err);
        }
    });

    return globalErrors;

}

export function handleServerSideValidationError(err: any, form: AbstractControl) {
    if (err instanceof HttpErrorResponse) {
        if (err.status === 422) {
            const globalErrors = applyValidationErrors(form, err.error);
            console.log('global errors are', globalErrors);
        }
    }
}