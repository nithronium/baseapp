import { RootState } from '../../../modules';
import { ReferralComissionState } from './reducer';

export const selectReferralComission = (state: RootState): ReferralComissionState => state.user.referralComission;
