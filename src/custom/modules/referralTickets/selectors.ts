import { RootState } from '../../../modules';
import { ReferralTicketsState } from './reducer';

export const selectReferralTicketsLoading = (state: RootState): boolean => state.user.referralTickets.loading;
export const selectReferralTicketsOverall = (state: RootState): ReferralTicketsState['data']['overall'] => state.user.referralTickets.data.overall;
export const selectReferralTicketsDirect = (state: RootState): ReferralTicketsState['data']['direct'] => state.user.referralTickets.data.direct;
export const selectReferralTicketsReferrals = (state: RootState): ReferralTicketsState['data']['referrals'] => state.user.referralTickets.data.referrals;
export const selectReferralTicketsBonuses = (state: RootState): ReferralTicketsState['data']['bonuses'] => state.user.referralTickets.data.bonuses;
