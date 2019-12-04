import { Decimal, Loader, Pagination } from '@openware/components';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {connect, MapDispatchToPropsFunction} from 'react-redux';
import { History } from '../../../../components';
import {
    localeDate,
    preciseData,
} from '../../../../helpers';
import {
    currenciesFetch,
    Currency,
    RootState,
    selectCurrencies,
} from '../../../../modules';
import {
    ieoHistoryFetch,
    selectIEOHistoryCurrentPage,
    selectIEOHistoryData,
    selectIEOHistoryFirstElemIndex,
    selectIEOHistoryLastElemIndex,
    selectIEOHistoryLoading,
    selectIEOHistoryNextPageExists,
    selectIEOHistoryPageCount,
    selectIEOHistoryTotal,
} from '../../modules';
import { OrderIEOData } from '../../modules/user/types';

interface ReduxProps {
    list: OrderIEOData[];
    fetching: boolean;
    total: number;
    page?: number;
    pageCount?: number;
    firstElemIndex?: number;
    lastElemIndex?: number;
    nextPageExists: boolean;
    currencies: Currency[];
}

interface DispatchProps {
    ieoHistoryFetch: typeof ieoHistoryFetch;
    fetchCurrencies: typeof currenciesFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class HistoryComponent extends React.Component<Props> {
    public componentDidMount() {
        const { currencies } = this.props;
        this.props.ieoHistoryFetch({ page: 1, limit: 25, state: 'completed' });

        if (!currencies.length) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { currencies } = this.props;

        if (!nextProps.currencies.length && JSON.stringify(nextProps.currencies) !== JSON.stringify(currencies)) {
            this.props.fetchCurrencies();
        }
    }

    public render() {
        const { list, fetching } = this.props;
        return (
          <div className={`pg-history-elem ${list.length ? '' : 'pg-history-elem-empty'}`}>
              {fetching && <Loader />}
              {list.length ? this.renderContent() : null}
              {!list.length && !fetching ? <p className="pg-history-elem__empty">{this.props.intl.formatMessage({id: 'page.noDataToShow'})}</p> : null}
          </div>
        );
    }

    public renderContent = () => {
        const { firstElemIndex, lastElemIndex, fullHistory, page, nextPageExists } = this.props;

        return (
            <React.Fragment>
                <History headers={this.renderHeaders()} data={this.retrieveData()}/>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    total={fullHistory}
                    page={page - 1}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </React.Fragment>
        );
    };

    private onClickPrevPage = () => {
        const { page } = this.props;
        this.props.ieoHistoryFetch({ page: +page - 1, limit: 25, state: 'completed' });
    };

    private onClickNextPage = () => {
        const { page } = this.props;
        this.props.ieoHistoryFetch({ page: +page + 1, limit: 25, state: 'completed' });
    };

    private renderHeaders = () => ([
        this.props.intl.formatMessage({id: 'page.body.ieo.history.date'}),
        this.props.intl.formatMessage({id: 'page.body.ieo.history.name'}),
        this.props.intl.formatMessage({id: 'page.body.ieo.history.tokensOrdered'}),
        this.props.intl.formatMessage({id: 'page.body.ieo.history.paidAmount'}),
        this.props.intl.formatMessage({id: 'page.body.ieo.history.receivedAmount'}),
        this.props.intl.formatMessage({id: 'page.body.ieo.history.fees'}),
    ]);

    private retrieveData = () => {
        const { list } = this.props;
        return [...list]
            .map(item => this.renderTableRow(item));
    };

    private renderTableRow = item => {
        const {
            created_at,
            sale_name,
            base_currency,
            contribution,
            tokens_received,
            commission_rate,
            quote_currency,
        } = item;
        const quotePrecision = quote_currency && this.getPrecision(quote_currency);
        const fee = this.convertComissionAmount(tokens_received, commission_rate);

        return [
            localeDate(created_at, 'fullDate'),
            sale_name,
            base_currency && base_currency.toUpperCase(),
            `${Decimal.format(contribution, quotePrecision)} ${quote_currency && quote_currency.toUpperCase()}`,
            `${tokens_received} ${base_currency && base_currency.toUpperCase()}`,
            `${fee} ${base_currency && base_currency.toUpperCase()}`,
        ];
    }

    private getPrecision = name => {
        const { currencies } = this.props;

        return currencies.length &&
            +currencies.filter(item => item.id && item.id.toLowerCase() === name.toLowerCase())[0].precision;
    };

    private convertComissionAmount = (tokensReceived, commissionRate) =>
        preciseData(+tokensReceived * +commissionRate / (1 - +commissionRate), +this.getValuePrecision(tokensReceived));

    private getValuePrecision = value => value.split('.')[1] ? value.split('.')[1].length : 0;
}


const mapStateToProps = (state: RootState): ReduxProps => ({
    list: selectIEOHistoryData(state),
    fetching: selectIEOHistoryLoading(state),
    page: selectIEOHistoryCurrentPage(state),
    pageCount: selectIEOHistoryPageCount(state, 25),
    firstElemIndex: selectIEOHistoryFirstElemIndex(state, 1),
    lastElemIndex: selectIEOHistoryLastElemIndex(state, 25),
    nextPageExists: selectIEOHistoryNextPageExists(state, 25),
    total: selectIEOHistoryTotal(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        ieoHistoryFetch: payload => dispatch(ieoHistoryFetch(payload)),
        fetchCurrencies: () => dispatch(currenciesFetch()),
    });

const HistoryIEOElement = injectIntl(connect(mapStateToProps, mapDispatchToProps)(HistoryComponent));

export {
    HistoryIEOElement,
};
