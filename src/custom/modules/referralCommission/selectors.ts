import { RootState } from '../../../modules';
import { ReferralCommissionState } from './reducer';

export const selectReferralCommission = (state: RootState): ReferralCommissionState => state.user.referralCommission;

