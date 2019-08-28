import { WalletItemProps } from '../../components/WalletItem';

export const getWalletTotal = (wallet: WalletItemProps): number => {
    return Number(wallet.balance) + (Number(wallet.locked) || 0);
};
