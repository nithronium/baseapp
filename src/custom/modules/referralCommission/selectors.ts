import { RootState } from '../../../modules';
import { ReferralCommissionBalancesInterface, ReferralCommissionReferralsInterface } from './reducer';

export const selectReferralCommissionTrading = (state: RootState): ReferralCommissionReferralsInterface => state.user.referralCommission.data.trading;
export const selectReferralCommissionIeo = (state: RootState): ReferralCommissionReferralsInterface => state.user.referralCommission.data.ieo;
export const selectReferralCommissionBalances = (state: RootState): ReferralCommissionBalancesInterface => state.user.referralCommission.data.balances;
