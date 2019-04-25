export class Ticket {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
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
}

export class Field {
    fieldIndex: number;
    fieldValue: string;
}