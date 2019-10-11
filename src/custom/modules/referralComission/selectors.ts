import { RootState } from '../../../modules';
import { ReferralComissionSummaryInterface, ReferralComissionTradingInterface } from './reducer';

export const selectReferralComissionTrading = (state: RootState): ReferralComissionTradingInterface => state.user.referralComission.data.trading;
export const selectReferralComissionIeo = (state: RootState): ReferralComissionTradingInterface => state.user.referralComission.data.ieo;
export const selectReferralComissionSummary = (state: RootState): ReferralComissionSummaryInterface => state.user.referralComission.data.summary;
