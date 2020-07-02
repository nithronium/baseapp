import { Button } from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    labelFetch,
    RootState,
    selectCurrentLanguage,
    selectUserInfo,
    User,
} from '../../../../modules';
import { changeUserLevel } from '../../../../modules/user/profile';
import { kycAuthFetch, selectKycAuthData } from '../../../modules';
import { KycAuthDataInterface } from '../../../modules/user/kycAuth/types';

import { handleRedirectToConfirm } from '../../../helpers';

interface ReduxProps {
    kycAuthData?: KycAuthDataInterface;
    user: User;
    currentLanguage: string;
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

        if (event.data.status && event.data.status.toLowerCase() !== 'failed') {
            this.setState({
                statusGet: true,
            });
        }
    };

    public backBtn = () => handleRedirectToConfirm('phoneStep', this.props.history);

    private renderContent = () => {
        const { kycAuthData, currentLanguage } = this.props;
        const lang = currentLanguage.toLowerCase() === 'zh' ? 'en' : currentLanguage.toLowerCase();
        return this.state.statusGet ? (
            <div className="pg-idenfy">
                <iframe
                    id="iframe"
                    src={`https://ui.idenfy.com/?authToken=${kycAuthData ? kycAuthData.auth_token : ''}&lang=${lang}`}
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
                        <p>{this.translate('page.idenfy.if')}</p>
                        <p>{this.translate('page.idenfy.thanks')}</p>
                    </div>
                    <div className="pg-confirm__content-deep">
                        <Button
                            className="pg-confirm__content-deep-back"
                            label={this.props.intl.formatMessage({ id: 'page.body.kyc.back' })}
                            onClick={this.backBtn}
                        />
                        <div className="pg-confirm__content-deep-margin" />
                        <Button
                            className="pg-confirm__content-phone-deep-button"
                            label={this.props.intl.formatMessage({ id: 'page.idenfy.understand' })}
                            onClick={this.onBackButtonClick}
                        />
                    </div>
                </div>
            </div>
        );
    };

    private onBackButtonClick = () => {
        const { history } = this.props;
        this.props.changeUserLevel({ level: 4 });
        handleRedirectToConfirm('addressStep', history);
    }
}


const mapStateToProps = (state: RootState): ReduxProps => ({
    kycAuthData: selectKycAuthData(state),
    user: selectUserInfo(state),
    currentLanguage: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        labelFetch: () => dispatch(labelFetch()),
        kycAuthFetch: () => dispatch(kycAuthFetch()),
    });

// tslint:disable-next-line
export const Idenfy = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(IdenfyContainer) as any));
