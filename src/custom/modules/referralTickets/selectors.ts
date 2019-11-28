import { RootState } from '../../../modules';
import { ReferralOverallState } from './reducer';

export const selectReferralTicketsLoading = (state: RootState): boolean => state.user.referralTickets.loading;
export const selectReferralTicketsOverall = (state: RootState): ReferralOverallState['data']['overall'] => state.user.referralTickets.data.overall;
export const selectReferralTicketsDirect = (state: RootState): ReferralOverallState['data']['direct'] => state.user.referralTickets.data.direct;
// export const selectReferralTicketsReferrals = (state: RootState): ReferralOverallState['data']['referrals'] => state.user.referralTickets.data.referrals;
export const selectReferralTicketsBonuses = (state: RootState): ReferralOverallState['data']['bonuses'] => state.user.referralTickets.data.bonuses;
