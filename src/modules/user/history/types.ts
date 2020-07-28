import { CommonState } from '../../types';

export interface PublicTrade {
    id: number;
    price: string;
    total: string;
    amount: string;
    market: string;
    created_at: string;
    taker_type: string;
}

export interface PrivateTrade extends PublicTrade {
    side?: string;
    order_id?: number;
}

export interface PrivateTradeEvent {
    id: number;
    price: string;
    total: string;
    amount: string;
    market: string;
    created_at: string;
    taker_type: string;
    side?: string;
    order_id?: number;
}

export interface PrivateTradesState extends CommonState {
    list: PrivateTrade[];
}

export type MakerType = 'buy' | 'sell';

export interface Withdraw {
    currency: string;
    id: number;
    type: string;
    amount: string;
    fee: string;
    blockchain_txid: string;
    rid: string;
    state: string;
    created_at: string;
    updated_at: string;
    completed_at: string;
    done_at: string;
}

export interface Deposit {
    currency: string;
    id: number;
    amount: string;
    fee: string;
    txid: string;
    created_at: string;
    confirmations: number;
    completed_at: string;
    state: string;
}

export interface Payment {
    id?: number;
    uid?: string;
    tid?: string;
    order_id?: number;
    sale_id?: number;
    outcome_currency_id?: string;
    income_currency_id?: string;
    status?: string;
    origin_volume?: number;
    fee?: number;
}

export type WalletHistoryElement = Withdraw | Deposit | PrivateTrade | Payment;
export type WalletHistoryList = WalletHistoryElement[];
