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

    description: {[key: string]: Description};
}

export class Description {
    label: string;
    placeholder: string;
    restrictedValuesDescription: {[key: string]: string};
}

export class Field {
    fieldIndex: number;
    fieldValue: string;
}