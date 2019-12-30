import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { History } from 'history';

import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { getBalance } from '../../api';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { ProfileApiKeys } from '../../containers/ProfileApiKeys';
import { ProfileApiKeysLite } from '../../containers/ProfileApiKeysLite';
import { ReferralProgram } from '../../containers/ReferralProgram';
import { ProfileAuthDetails } from '../../custom/containers';
import { ProfileVerification } from '../../custom/containers/ProfileVerification';
import { VersionGuardWrapper } from '../../decorators';
import { setDocumentTitle } from '../../helpers';

interface HistoryProps {
    history: History;
}

type Props = RouterProps & HistoryProps;

class ProfileComponent extends React.Component<Props> {

    public state = {
        balance: 0,
    };

    public componentDidMount() {
        setDocumentTitle('Profile');
        // tslint:disable-next-line: no-floating-promises
        getBalance().then(data => {
            this.setState({
                balance: data.balance || 0,
            });
        })
            .catch(() => {
                this.setState({ balance: 0 });
            });
    }

    public goBack = () => {
        this.props.history.goBack();
    };
//tslint:disable
    public render() {
        return (
            <div className="container pg-profile-page">
                <div className="pg-profile-page__details">
                    <div className="row pg-profile-page-header pg-profile-page-header-first">
                        <h3 className="col-12">
                            <FormattedMessage id="page.body.profile.header.account"/>
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6 mx-0">
                            <div className="row col-12 mx-0">
                                <ProfileAuthDetails/>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <ProfileVerification history={this.props.history} balance={this.state.balance}/>
                        </div>
                    </div>
                    <div className="row px-4">
                        <div className="col-12 mx-0">
                            {VersionGuardWrapper(ReferralProgram)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {VersionGuardWrapper(ProfileApiKeys, ProfileApiKeysLite, false)}
                    </div>
                    <div className="col-12">
                        <ProfileAccountActivity/>
                    </div>
                </div>
            </div>
        );
    }
}

// tslint:disable-next-line:no-any
const ProfileScreen = withRouter(ProfileComponent as any);

export {
    ProfileScreen,
};
