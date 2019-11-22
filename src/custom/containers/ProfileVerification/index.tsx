import classnames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Label,
    labelFetch,
    selectLabelData,
    selectUserInfo,
    selectWithdrawLimit,
    User,
    withdrawLimitFetch,
} from '../../../modules';
import { WithdrawLimit } from '../../../modules/user/withdrawLimit';

interface ReduxProps {
    label: Label[];
    withdrawLimitData: WithdrawLimit;
    user: User;
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
    withdrawLimitFetch: typeof withdrawLimitFetch;
}

type Props = ReduxProps & DispatchProps;

class ProfileVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.labelFetch();
        this.props.withdrawLimitFetch();
    }

    public renderUserLevel(level: number) {
        const firstCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 1,
        });

        const secondCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 2,
        });

        const thirdCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 3,
        });

        return (
            <div className="pg-profile-verification__level">
                <div className={firstCircleClassName}>1</div>
                <div className="pg-profile-verification__level__line" />
                <div className={secondCircleClassName}>2</div>
                <div className="pg-profile-verification__level__line" />
                <div className={thirdCircleClassName}>3</div>
            </div>
        );
    }

    public renderUpgradeLevelLink() {
        return (
            <Link to="/confirm" className="pg-profile-verification__upgrade-level">
            <FormattedMessage id="page.body.profile.header.account.profile.upgrade"/>
        </Link>
        );
    }

    public renderUserAbilities(level: number) {
        return (
            <div className="pg-profile-verification__abilities">
                {level >= 1 && <FormattedMessage id="page.body.profile.header.account.profile.abilities.first" />}
                {level >= 2 && <FormattedMessage id="page.body.profile.header.account.profile.abilities.second" />}
                {level >= 3 && <FormattedMessage id="page.body.profile.header.account.profile.abilities.third" />}
            </div>
        );
    }

    public renderWithdrawLimit(userLevel: number, withdrawLimitData: WithdrawLimit) {
        const percentage = Math.round(+withdrawLimitData.withdrawal_amount / +withdrawLimitData.limit * 100);

        if (!userLevel) {
            return (
                <div className="pg-profile-verification__withdraw-limit">
                    <div className="pg-profile-verification__withdraw-limit__wrap" />
                    <div className="pg-profile-verification__withdraw-limit__know-more">
                        <Link to="#">
                            <FormattedMessage id="page.body.profile.header.account.profile.knowMore" />
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="pg-profile-verification__withdraw-limit">
                <div className="pg-profile-verification__withdraw-limit__wrap">
                    <div className="pg-profile-verification__withdraw-limit__wrap__progress-bar">
                        <div className="pg-profile-verification__withdraw-limit__wrap__progress-bar--filled" style={{width: `${percentage}%`}} />
                    </div>
                    <span className="pg-profile-verification__withdraw-limit__wrap__text">
                        <FormattedMessage id="page.body.profile.header.account.profile.withdraw" />
                        &nbsp;{withdrawLimitData.withdrawal_amount} / {withdrawLimitData.limit} {withdrawLimitData.currency.toUpperCase()}
                    </span>
                </div>
                <div className="pg-profile-verification__withdraw-limit__know-more">
                    <Link to="#">
                        <FormattedMessage id="page.body.profile.header.account.profile.knowMore" />
                    </Link>
                </div>
            </div>
        );
    }

    public render() {
        const { user, withdrawLimitData } = this.props;
        const userLevel = user.level;

        return (
            <div className="pg-profile-verification">
                <div className="pg-profile-verification__title">
                    <FormattedMessage id="page.body.profile.header.account.profile"/>
                </div>
                {this.renderUserLevel(userLevel)}
                {userLevel < 3 && this.renderUpgradeLevelLink()}
                {this.renderUserAbilities(userLevel)}
                {this.renderWithdrawLimit(userLevel, withdrawLimitData)}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    label: selectLabelData(state),
    withdrawLimitData: selectWithdrawLimit(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        labelFetch: () => dispatch(labelFetch()),
        withdrawLimitFetch: () => dispatch(withdrawLimitFetch()),
    });

const ProfileVerification = connect(mapStateToProps, mapDispatchProps)(ProfileVerificationComponent);

export {
    ProfileVerification,
};
