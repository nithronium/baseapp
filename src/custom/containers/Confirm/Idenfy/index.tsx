import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RootState } from '../../../../modules';
import { changeUserLevel } from '../../../../modules/user/profile';
import { kycAuthFetch, selectKycAuthData } from '../../../modules';
import { KycAuthDataInterface } from '../../../modules/user/kycAuth/types';

interface ReduxProps {
    kycAuthData?: KycAuthDataInterface;
}

interface DispatchProps {
    changeUserLevel: typeof changeUserLevel;
    kycAuthFetch: typeof kycAuthFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class IdenfyContainer extends React.Component<Props> {
    public componentDidMount() {
        window.addEventListener('message', this.handleReceiveMessage, false);
        this.props.kycAuthFetch();
    }

    public componentWillUnmount() {
        window.removeEventListener('message', this.handleReceiveMessage, false);
    }

    public render() {
        const { kycAuthData } = this.props;

        return (
            <div className="pg-idenfy">
                <iframe
                    id="iframe"
                    src={`https://ui.idenfy.com/?authToken=${kycAuthData ? kycAuthData.auth_token : ''}`}
                    allow="camera"
                />
                <p id="display" />
            </div>
        );
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public handleReceiveMessage = event => {
        if (event.data.status && event.data.status !== 'failed') {
            this.props.changeUserLevel({ level: 2 });
        }
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    kycAuthData: selectKycAuthData(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        kycAuthFetch: () => dispatch(kycAuthFetch()),
    });

// tslint:disable-next-line
export const Idenfy = injectIntl(connect(mapStateToProps, mapDispatchProps)(IdenfyContainer) as any);