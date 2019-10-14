import { RootState } from '../../../modules';
import { ReferralCommissionSummaryInterface, ReferralCommissionTradingInterface } from './reducer';

export const selectReferralCommissionTrading = (state: RootState): ReferralCommissionTradingInterface => state.user.referralCommission.data.trading;
export const selectReferralCommissionIeo = (state: RootState): ReferralCommissionTradingInterface => state.user.referralCommission.data.ieo;
export const selectReferralCommissionSummary = (state: RootState): ReferralCommissionSummaryInterface => state.user.referralCommission.data.summary;
