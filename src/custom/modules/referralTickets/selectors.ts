import { RootState } from '../../../modules';
import { ReferralTicketsState } from './reducer';

export const selectReferralTickets = (state: RootState): ReferralTicketsState => state.user.referralTickets;
