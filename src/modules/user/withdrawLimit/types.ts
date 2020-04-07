export interface WithdrawLimit {
    withdraw: {
        limit: number | string,
        period: number,
        withdrawal_amount: number | string,
        currency: string,
    };
    deposit: {
        limit: number | string,
        period: number,
    };
    limit?: string;
}
