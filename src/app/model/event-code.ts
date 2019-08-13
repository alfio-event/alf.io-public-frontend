export class EventCode {
    code: string;
    type: EventCodeType;
    discountType: DiscountType;
    discountAmount: string;
}

export type EventCodeType = 'SPECIAL_PRICE' | 'DISCOUNT' | 'ACCESS';
export type DiscountType = 'FIXED_AMOUNT' | 'PERCENTAGE' | 'NONE';
