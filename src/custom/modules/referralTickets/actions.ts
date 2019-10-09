import { CommonError } from '../../../modules/types';
import { REFERRAL_TICKETS_DATA, REFERRAL_TICKETS_ERROR, REFERRAL_TICKETS_FETCH } from './constants';

export interface ReferralTicketsFetch {
    type: typeof REFERRAL_TICKETS_FETCH;
}

export interface ReferralTicketsError {
    type: typeof REFERRAL_TICKETS_ERROR;
    payload?: CommonError;
}

export interface ReferralPayload {
    tickets: number; // кол-во тикетов, полученных за реферала
    email: string; // email реферала
    isActive: boolean; // статус реферала
    subreferrals: number; // кол-во рефералов 2-го уровня
    activeSubreferrals: number; // кол-во активных рефералов 2-го уровня
}

export interface BonusPayload {
    tickets: number;  // кол-во тикетов, полученных за бонус
    action: string; // тип бонуса (e. g. facebook post)
    link: string; // ссылка на пост
}

export interface ReferralTicketsPayload {
    user: {
        usdBalance: number, // баланс пользователя в USD
        emrxBalance: number, // баланс пользователя в EMRX
        usdTickets: number, // тикеты, полученные за пополнение баланса в USD
        emrxTickets: number, // тикеты, полученные за покупку EMRX
    };
    referrals: ReferralPayload[];
    bonuses: BonusPayload[];
}

export interface ReferralTicketsData {
    type: typeof REFERRAL_TICKETS_DATA;
    payload: ReferralTicketsPayload;
}

export type ReferralTicketsActions = ReferralTicketsFetch | ReferralTicketsData | ReferralTicketsError;

export const referralTicketsFetch = (): ReferralTicketsFetch => ({
    type: REFERRAL_TICKETS_FETCH,
});

export const referralTicketsData = (payload: ReferralTicketsData['payload']): ReferralTicketsData => ({
    type: REFERRAL_TICKETS_DATA,
    payload,
});

export const referralTicketsError = (payload: ReferralTicketsError['payload']): ReferralTicketsError => ({
    type: REFERRAL_TICKETS_ERROR,
    payload,
});
