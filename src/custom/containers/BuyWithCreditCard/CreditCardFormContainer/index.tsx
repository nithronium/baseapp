import * as React from 'react';

import * as moment from 'moment';

import qs from 'qs';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { Decimal } from '../../../../components';

import { convert } from '../helpers';

// import { getCumulativeTotal } from '../../../helpers';

import { getExchangeRates } from '../../../../api';

const excludedCurrencies = ['aed'];


import {
    currenciesFetch,
    Currency,
    Market,
    marketsFetch,
    orderBookFetch,
    OrderBookState,
    RootState,
    selectCurrencies,
    selectMarkets,
    selectOrderBook,
} from '../../../../modules';


interface ReduxProps {
    currencies: Currency[];
    markets: Market[];
    orderBook: OrderBookState;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchMarkets: typeof marketsFetch;
    fetchOrderBook: typeof orderBookFetch;
}

type Props = InjectedIntlProps & ReduxProps & DispatchProps & {
    swapped: boolean;
    onSwap: () => void;
    onFiatValueChange: () => void;
    onFiatChange: () => void;
    fiatValue: string;
    fiat: string;
    fiatList: string[];
    onCryptoValueChange: () => void
    onCryptoChange: () => void;
    cryptoValue: string;
    crypto: string;
    cryptoList: string[];
    Component: React.Component;
    onChange: () => void;
    cryptoForFiatOnly: boolean;
};


interface ConvertedResponse {
    symbol: string;
    amount: number;
    quote: Array<{
        symbol: string;
        price: number;
    }>;
}

interface State {
    converted: ConvertedResponse;
}

class CreditCardFormContainerLocal extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            converted: {
                symbol: 'USD',
                amount: 1,
                quote: [],
            },
        };
    }

    public componentDidMount() {
        const { fiat, currencies, markets, onChange } = this.props;
        this.props.fetchCurrencies();
        this.props.fetchMarkets();

        if (currencies.length && markets.length) {
            const fiatList = this.getAvailableFiat(this.props);
            const cryptoList = this.getAvailableCrypto(fiat, this.props);
            onChange({
                fiatList,
                cryptoList,
            });
        }

    }
    public async componentWillReceiveProps(nextProps) {
        const { currencies, markets, crypto, onChange } = this.props;
        let { fiat } = this.props;
        if (currencies.length !== nextProps.currencies.length ||
            markets.length !== nextProps.markets.length)
        {
            if (!nextProps.markets.length || !nextProps.currencies.length) { return; }
            const query = qs.parse(location.search, { ignoreQueryPrefix: true });
            let newCrypto = query.curr;
            const fiatList = this.getAvailableFiat(nextProps);
            const cryptoList = this.getAvailableCrypto(fiat, nextProps);
            if (!this.getAllCrypto(nextProps).includes(newCrypto)) {
                newCrypto = cryptoList[0] || 'usdt';
            }
            if (query.curr) {
                fiat = this.getFiatForCrypto(newCrypto, nextProps);
            }
            const partialState = {
                fiatList,
                cryptoList,
                crypto: newCrypto,
                fiat,
                fiatValue: '',
                cryptoValue: '',
                // converted: {} as ConvertedResponse,
            };
            if (query.fiat) {
                partialState.fiat = query.fiat;
                partialState.crypto = query.crypto;
            }
            if (query.fiatValue || query.cryptoValue) {
                partialState.fiatValue = query.fiatValue;
                partialState.cryptoValue = query.cryptoValue;
            }
            const marketCurrencies = this.getAllCurrencies(nextProps);
            const converted = await getExchangeRates(
                'USD', 1, marketCurrencies,
            );
            this.setState({ converted });
            this.props.fetchOrderBook(nextProps.markets);
            onChange({
                ...partialState,
                converted,
            });
        }

        if (this.props.orderBook.market !== nextProps.orderBook.market) {
            const { fiatValue } = this.props;
            const cryptoNumber = this.convertToCrypto(+fiatValue, nextProps);
            const cryptoFormatted = Number(cryptoNumber).toFixed(this.getPrecision(crypto));
            const cryptoValue = cryptoFormatted.toString();
            onChange({ cryptoValue });
        }

        if (fiat !== nextProps.fiat || crypto !== nextProps.crypto) {
            this.fetchMarket(nextProps);
        }


        // change in the parent
        if (nextProps.cryptoValue === null) {
            const { fiatValue } = nextProps;
            const cryptoValue = Number(this.convertToCrypto(fiatValue, nextProps))
                .toFixed(this.getPrecision(crypto));
            onChange({ cryptoValue, keepPercentage: true });
        }
        if (nextProps.fiatValue === null) {
            const { cryptoValue } = nextProps;
            const fiatValue = Number(this.convertToFiat(cryptoValue, nextProps))
                .toFixed(this.getPrecision(fiat));
            onChange({ fiatValue, keepPercentage: true });
        }
    }

    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public onFiatValueChange = e => {
        const { crypto, onChange } = this.props;
        let { cryptoValue } = this.props;
        const fiatValue = e.target.value;
        const fiatValueNumber = Number(fiatValue);
        // tslint:disable-next-line:no-console
        if (!Number.isNaN(fiatValueNumber)) {
            const cryptoNumber = this.convertToCrypto(fiatValueNumber);
            const cryptoFormatted = Decimal.format(cryptoNumber, this.getPrecision(crypto));
            cryptoValue = cryptoFormatted.toString();
        }
        if (!fiatValue) {
            cryptoValue = '';
        }
        onChange({ fiatValue, cryptoValue });
    };

    public onCryptoValueChange = e => {
        const { fiat, onChange } = this.props;
        let { fiatValue } = this.props;
        const cryptoValue = e.target.value;
        const cryptoValueNumber = Number(cryptoValue);
        if (!Number.isNaN(cryptoValueNumber)) {
            const fiatNumber = this.convertToFiat(cryptoValueNumber);
            const fiatFormatted = Decimal.format(fiatNumber, this.getPrecision(fiat));
            // console.log('fiatFormatted', fiatFormatted);
            fiatValue = fiatFormatted.toString();
        }
        if (!cryptoValue) {
            fiatValue = '';
        }
        onChange({ fiatValue, cryptoValue });
    };

    public getPrecision = (currency: string) => {
        const { currencies } = this.props;
        for (const item of currencies) {
            if (item.id.toLowerCase() === currency.toLowerCase()) {
                return item.precision;
            }
        }

        return 2;
    };

    public convertToFiat = (cryptoValue: number, props: Props = this.props) => {
        if (!cryptoValue) {
            return '';
        }
        const fiatNoFee = convert(cryptoValue, 'fiat', props.orderBook);
        const fee = fiatNoFee * 4.5 / 100 + 0.1;

        return fiatNoFee + fee;
    };

    public convertToCrypto = (fiatValue: number, props: Props = this.props) => {
        const fee = fiatValue * 4.5 / 100 + 0.1;
        const res = fiatValue - fee;
        if (res < 0) {
            return 0;
        }

        return convert(res, 'crypto', props.orderBook);
    };

    public convertFromUsd = (currency, value) => {
        const { converted } = this.state;
        const convertedItem = converted.quote.filter(({ symbol }) => {
            return symbol.toLowerCase() === currency.toLowerCase();
        })[0];
        if (!convertedItem) {
            return value;
        }

        return value * convertedItem.price;
    };

    public onFiatChange = e => {
        let { crypto } = this.props;
        const { onChange } = this.props;
        const fiat = e.value.toLowerCase();
        const cryptoList = this.getAvailableCrypto(fiat);
        if (!cryptoList.includes(crypto)) {
            crypto = cryptoList[0];
        }
        onChange({ fiat, crypto, cryptoList });
    };

    public onCryptoChange = e => {
        const { fiat, onChange } = this.props;
        const crypto = e.value.toLowerCase();
        onChange({ fiat, crypto });
    };

    public getAvailableCrypto = (fiat: string, props = this.props): string[] => {
        const cryptoMarkets = this.getAvailableMarkets(props);
        const marketsWithAvailableFiat = cryptoMarkets.filter(({ state }) => {
            return state === 'enabled';
        }).filter(({ quote_unit }) => {
            return quote_unit === fiat;
        });
        const res = new Set<string>();
        for (const item of marketsWithAvailableFiat) {
            res.add(item.base_unit);
        }

        return Array.from(res);
    };

    public getAvailableFiat = (props = this.props): string[] => {
        const { markets, cryptoForFiatOnly } = props;
        const enbledMarkets = markets.filter(({ state }) => {
            return state === 'enabled';
        }).filter(({ quote_unit }) => {
            return !excludedCurrencies.includes(quote_unit);
        });
        const marketsWithFiat = enbledMarkets.filter(({ quote_unit }) => {
            return !cryptoForFiatOnly || this.isFiat(quote_unit, props);
        });
        const res = new Set<string>();
        for (const item of marketsWithFiat) {
            res.add(item.quote_unit);
        }

        return Array.from(res);
    };

    public getAvailableMarkets = (props: Props = this.props) => {
        const { markets, cryptoForFiatOnly } = props;

        return markets.filter(({ state }) => {
            return state === 'enabled';
        }).filter(({ base_unit }) => {
            return !cryptoForFiatOnly || this.isCrypto(base_unit, props);
        }).filter(({ quote_unit }) => {
            return !cryptoForFiatOnly || this.isFiat(quote_unit, props);
        });
    };

    public isCrypto = (currency: string, props = this.props) => {
        return this.getCurrenciesByType('coin', props)
            .some(item => item.id === currency);
    };

    public isFiat = (currency: string, props = this.props) => {
        return this.getCurrenciesByType('fiat', props)
            .some(item => item.id.toLowerCase() === currency.toLowerCase());
    };

    public getCurrenciesByType = (type: string, props?) => {
        const { currencies } = (props || this.props);

        return currencies.filter(item => {
            return item.type === type;
        });
    };

    public findMarket = (fiat: string, crypto: string): Market => {
        const { markets } = this.props;

        return markets.filter((market: Market) => {
            return (market.base_unit.toLowerCase() === fiat.toLowerCase() &&
                market.quote_unit.toLowerCase() === crypto.toLowerCase()) ||

                (market.quote_unit.toLowerCase() === fiat.toLowerCase() &&
                market.base_unit.toLowerCase() === crypto.toLowerCase());
        })[0];
    };

    public fetchMarket = (props: Props = this.props) => {
        const { fiat, crypto } = props;
        const market = this.findMarket(fiat, crypto);
        this.props.fetchOrderBook(market);
    };

    public formatTime = () => {
        return moment().format('HH:mm:SS DD.MM.YYYY');
    };

    public getFiatForCrypto = (crypto, props = this.props) => {
        const marketsWithCrypto = this.getAvailableMarkets(props)
            .filter(({ base_unit }) => {
                return base_unit === crypto;
            });
        if (!marketsWithCrypto.length) {
            return '';
        }

        return marketsWithCrypto[0].quote_unit;
    };

    public getAllCrypto = (props = this.props) => {
        const cryptoMarkets = this.getAvailableMarkets(props);

        return cryptoMarkets.map(({ base_unit }) => base_unit);
    };

    public getAllCurrencies = (props: Props = this.props) => {
        const { markets } = props;
        const res = new Set<string>();
        const enablesMarkets = markets.filter(({ state }) => {
            return state === 'enabled';
        });
        for (const market of enablesMarkets) {
            const { base_unit, quote_unit } = market;
            res.add(base_unit);
            res.add(quote_unit);
        }

        return Array.from(res);
    };

    public getFiatPlaceholder = () => {
        const { fiat, crypto } = this.props;
        const market = this.findMarket(fiat, crypto);
        if (!market) {
            return '';
        }
        const cryptoMin = +market.min_amount;
        const fiatMin = this.convertToFiat(cryptoMin);
        const fiatMinFormatted = +Decimal.format(fiatMin, this.getPrecision(fiat));

        return `Min. Order: ${fiatMinFormatted} ${fiat.toUpperCase()}`;
    };

    public getCryptoPlaceholder = () => {
        const { fiat, crypto } = this.props;
        const market = this.findMarket(fiat, crypto);
        if (!market) {
            return '';
        }

        return `Min. Order: ${market.min_amount} ${crypto.toUpperCase()}`;
    };

    public render() {
        const {
            Component,
            fiat, crypto, fiatValue, cryptoValue, swapped,
            onSwap, fiatList, cryptoList,
        } = this.props;

        return (
            <>
                <Component
                    fiat={fiat}
                    crypto={crypto}
                    fiatValue={fiatValue}
                    cryptoValue={cryptoValue}
                    swapped={swapped}
                    onSwap={onSwap}
                    fiatList={fiatList}
                    cryptoList={cryptoList}
                    onFiatValueChange={this.onFiatValueChange}
                    onFiatChange={this.onFiatChange}
                    onCryptoValueChange={this.onCryptoValueChange}
                    onCryptoChange={this.onCryptoChange}
                    fiatPlaceholder={this.getFiatPlaceholder()}
                    cryptoPlaceholder={this.getCryptoPlaceholder()}
                />
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currencies: selectCurrencies(state),
    markets: selectMarkets(state),
    orderBook: selectOrderBook(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchOrderBook: payload => dispatch(orderBookFetch(payload)),
    fetchMarkets: () => dispatch(marketsFetch()),
});

export const CreditCardFormContainer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreditCardFormContainerLocal));
