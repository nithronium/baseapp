// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { walletsData, walletsError } from '../actions';

const walletsOptions: RequestOptions = {
    apiVersion: 'peatio',
};
//tslint:disable
//  const mockCurr = [{"id":"usd","name":"US Dollar","symbol":"$","type":"fiat","deposit_fee":"0.0","min_deposit_amount":"0.01","withdraw_fee":"0.0","min_withdraw_amount":"0.0","withdraw_limit_24h":"100.0","withdraw_limit_72h":"200.0","base_factor":10,"precision":2},{"id":"fth","name":"Fiat Ethereum","symbol":"₪","type":"fiat","deposit_fee":"0.0","min_deposit_amount":"0.01","withdraw_fee":"0.0","min_withdraw_amount":"0.0","withdraw_limit_24h":"100.0","withdraw_limit_72h":"200.0","base_factor":1,"precision":2},{"id":"eth","name":"Ethereum","symbol":"Ξ","explorer_transaction":"https://rinkeby.etherscan.io/tx/#{txid}","explorer_address":"https://rinkeby.etherscan.io/address/#{address}","type":"coin","deposit_fee":"0.0","min_deposit_amount":"0.00021","withdraw_fee":"0.0","min_withdraw_amount":"0.0","withdraw_limit_24h":"0.2","withdraw_limit_72h":"0.5000000000000001","base_factor":1000000000000000000,"precision":8,"min_confirmations":6},{"id":"trst","name":"WeTrust","symbol":"Ξ","explorer_transaction":"https://rinkeby.etherscan.io/tx/#{txid}","explorer_address":"https://rinkeby.etherscan.io/address/#{address}","type":"coin","deposit_fee":"0.0","min_deposit_amount":"2.0","withdraw_fee":"0.0","min_withdraw_amount":"0.0","withdraw_limit_24h":"300.0","withdraw_limit_72h":"600.0","base_factor":1000000,"precision":8,"min_confirmations":6}];
//  const mockAcc = [{"currency":"eth","balance":"0.0","locked":"0.0"},{"currency":"fth","balance":"0.0","locked":"0.0"},{"currency":"trst","balance":"0.0","locked":"0.0"},{"currency":"usd","balance":"0.0","locked":"0.0"}];
const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsSaga() {
    try {
        let accounts = yield call(API.get(walletsOptions), '/account/balances');
        let currencies = yield call(API.get(currenciesOptions), '/public/currencies');
        // accounts = mockAcc;
        // currencies = mockCurr;
        const accountsByCurrencies = currencies.map(currency => {
            let walletInfo = accounts.find(wallet => wallet.currency === currency.id);

            if (!walletInfo) {
                walletInfo = {
                    currency: currency.id,
                };
            }

            return ({
                ...walletInfo,
                name: currency.name,
                explorerTransaction: currency!.explorer_transaction,
                explorerAddress: currency!.explorer_address,
                fee: currency!.withdraw_fee,
                type: currency!.type,
                fixed: currency!.precision,
                iconUrl: currency.icon_url,
            });
        });

        yield put(walletsData(accountsByCurrencies));
    } catch (error) {
        yield put(walletsError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
