export class EventCode {
    code: string;
    type: EventCodeType;
    discountType: DiscountType;
    discountAmount: string;
}

export type EventCodeType = 'SPECIAL_PRICE' | 'DISCOUNT' | 'ACCESS';
export type DiscountType = 'FIXED_AMOUNT' | 'PERCENTAGE' | 'NONE';

export interface DynamicDiscount {
    discount: string;
    discountType: DiscountType;
    formattedMessage: {[key: string]: string};
}
