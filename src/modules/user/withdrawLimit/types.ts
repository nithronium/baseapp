export interface WithdrawLimit {
    withdraw: {
        limit: number | string,
        period: number,
        amount: number | string,
        currency: string,
    };
    deposit: {
        limit: number | string,
        amount: number | string,
        period: number,
    };
    limit?: string;
}
