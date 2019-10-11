import { RootState } from '../../../modules';
import { ReferralTicketsState } from './reducer';

export const selectReferralTicketsLoading = (state: RootState): boolean => state.user.referralTickets.loading;
export const selectReferralTicketsDirect = (state: RootState): ReferralTicketsState['data']['user'] => state.user.referralTickets.data.user;
export const selectReferralTicketsReferrals = (state: RootState): ReferralTicketsState['data']['referrals'] => state.user.referralTickets.data.referrals;
export const selectReferralTicketsBonuses = (state: RootState): ReferralTicketsState['data']['bonuses'] => state.user.referralTickets.data.bonuses;
