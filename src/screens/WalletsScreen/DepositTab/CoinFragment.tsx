/*tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CurrencyInfo, DepositCrypto } from '../../../components';
import { WalletHistory } from '../../../containers/Wallets/History';
import { BlurComponent } from '../../../custom/components/Blur';
import { formatCCYAddress } from '../../../helpers';

export const CoinFragment = injectIntl(
    ({
        intl,
        currency,
        wallets,
        selectedWalletAddress,
        handleOnCopy,
        addressDepositError,
        selectedWalletIndex,
        userAgree,
        setUserAgree,
        usedCoins,
        setUsedCoins,
        user,
        withdrawLimitData,
     }) => {
        const usedCoinsLocal = usedCoins.slice();
        const format = intl.formatMessage;
        const text = format({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' });
        const getLimitDeposit = () => {
            return withdrawLimitData && withdrawLimitData.deposit ? (+withdrawLimitData.deposit.limit - +withdrawLimitData.deposit.amount) || 0 : 0;
        }
        const textLimit = `${format({ id: 'page.body.wallets.tabs.deposit.ccy.message.limits1' })} ${getLimitDeposit()} EUR ${format({ id: 'page.body.wallets.tabs.deposit.ccy.message.limits2' })}`;
        let walletAddress = formatCCYAddress(currency, selectedWalletAddress);
        const error = addressDepositError
            ? format({ id: addressDepositError.message })
            : format({ id: 'page.body.wallets.tabs.deposit.ccy.message.error' });
        if (!usedCoinsLocal.includes(currency)) {
            setUserAgree(false);
        } else {
            setUserAgree(true);
        }
        const setAgree = () => {
            setUserAgree(true);

            usedCoinsLocal.push(currency);
            localStorage.setItem('usedCoins', JSON.stringify(usedCoinsLocal));
            setUsedCoins(usedCoinsLocal);
        };
        const notice = currency === 'eth' ? format({ id: 'page.wallets.eth.notice' }) : null;
        const addressValue = walletAddress ?
            walletAddress :
            format({ id: 'page.body.wallets.tabs.deposit.ccy.message.generating' });
        const realWalletAddress = user.level < 2 ? error : addressValue;
        
        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                <BlurComponent isBlur={user.level < 4}>
                {!userAgree ? (
                    <div>
                        <h2 style={{ fontWeight: 400 }}>{format({ id: 'page.wallets.coin.notice' })}</h2>
                        <div
                            style={{
                                background: 'rgb(17, 179, 130)',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                fontSize: '18px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'inline-block',
                                textAlign: 'center',
                            }}
                            onClick={setAgree}
                        >
                            {format({ id: 'page.wallets.eth.notice.button' })}
                        </div>
                    </div>
                ) : (
                    <DepositCrypto
                        data={realWalletAddress}
                        handleOnCopy={handleOnCopy}
                        error={error}
                        text={text}
                        textLimit={textLimit}
                        notice={notice}
                        disabled={walletAddress === '' || user.level < 2}
                        disabledLimit={user.level > 5}
                        copiableTextFieldText={format({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' })}
                        copyButtonText={format({ id: 'page.body.wallets.tabs.deposit.ccy.message.button' })}
                    />
                )}
                {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </BlurComponent>
            </React.Fragment>
        );
    }
);
