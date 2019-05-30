export class Ticket {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    userLanguage: string;
    assigned: boolean;
    locked: boolean;
    ticketFieldConfigurationBeforeStandard: AdditionalField[];
    ticketFieldConfigurationAfterStandard: AdditionalField[];
}

export class AdditionalField {
    name: string;
    value: string;
    type: AdditionalFieldType;
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

export type AdditionalFieldType = 'input:text' | 'input:tel' | 'vat:eu' | 'textarea' | 'country' | 'select';
