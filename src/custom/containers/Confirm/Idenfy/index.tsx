import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    labelFetch,
    RootState,
    selectUserInfo,
    User,
} from '../../../../modules';
import { changeUserLevel } from '../../../../modules/user/profile';
import { kycAuthFetch, selectKycAuthData } from '../../../modules';
import { KycAuthDataInterface } from '../../../modules/user/kycAuth/types';

interface ReduxProps {
    kycAuthData?: KycAuthDataInterface;
    user: User;
}

interface DispatchProps {
    changeUserLevel: typeof changeUserLevel;
    labelFetch: typeof labelFetch;
    kycAuthFetch: typeof kycAuthFetch;
}

interface HistoryProps {
    history: History;
}

interface IdenfyState {
    statusGet: boolean;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps & RouterProps & HistoryProps;

class IdenfyContainer extends React.Component<Props, IdenfyState> {
    public state = {
        statusGet: false,
    };

    public componentDidMount() {
        window.addEventListener('message', this.handleReceiveMessage, false);
        this.props.kycAuthFetch();
    }

    public componentWillUnmount() {
        window.removeEventListener('message', this.handleReceiveMessage, false);
    }

    public render() {
        return (
            <div className="pg-idenfy-block">
                {this.renderContent()}
            </div>
        );
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public handleReceiveMessage = event => {

        if (event.data.status) {
            this.setState({
                statusGet: true,
            });
        }
    }

    private renderContent = () => {
        const { kycAuthData } = this.props;
        return !this.state.statusGet ? (
            <div className="pg-idenfy">
                <iframe
                    id="iframe"
                    src={`https://ui.idenfy.com/?authToken=${kycAuthData ? kycAuthData.auth_token : ''}`}
                    allow="camera"
                />
                <p id="display" />
            </div>
        ) : (
            <div className="pg-attemps-idenfy">
                <div className="pg-attemps-idenfy__content">
                    <div>
                        <p className="title">{this.translate('page.idenfy.dear-customer')}</p>
                        <p>{this.translate('page.idenfy.your-identity')}</p>
                        <p>{this.translate('page.idenfy.process')}</p>
                        <p>{this.translate('page.idenfy.please')}</p>
                        <p>{this.translate('page.idenfy.thanks')}</p>
                    </div>
                    <span className="back-button" onClick={this.onBackButtonClick}>
                        {this.translate('page.idenfy.understand')}
                    </span>
                </div>
            </div>
        );
    };

    private onBackButtonClick = () => {
        const { history } = this.props;

        history.push('/profile');
    }
}


const mapStateToProps = (state: RootState): ReduxProps => ({
    kycAuthData: selectKycAuthData(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        labelFetch: () => dispatch(labelFetch()),
        kycAuthFetch: () => dispatch(kycAuthFetch()),
    });

// tslint:disable-next-line
export const Idenfy = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(IdenfyContainer) as any));