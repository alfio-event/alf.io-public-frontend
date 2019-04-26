export class Ticket {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    assigned: boolean;
    ticketFieldConfigurationBeforeStandard: AdditionalField[];
    ticketFieldConfigurationAfterStandard: AdditionalField[];
}

export class AdditionalField {
    name: string;
    value: string;
    type: string;
    required: boolean;
    minLength: number;
    maxLength: number;
    restrictedValues: string[];
    fields: Field[];


    inputField: boolean;
    euVat: boolean;
    textareaField: boolean;
    countryField: boolean;
    selectField: boolean;

    //tmp
    labelDescription: string;


}

export class Field {
    fieldIndex: number;
    fieldValue: string;
}