import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router-dom';


import {
  RootState,
  selectCurrentColorTheme,
  selectCurrentLanguage,
  selectMobileWalletUi,
  setMobileWalletUi,
} from '../../modules';
import { NavBar } from '../NavBar';

interface HeaderState {
    isActive: boolean;
}

interface ReduxProps {
    colorTheme: string;
    currentLanguage: string;
    mobileWallet: string;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
}

// tslint:disable no-any jsx-no-multiline-js
class Head extends React.Component<any, HeaderState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isActive: false,
        };
    }

    public render() {
        const {
            location,
        } = this.props;
        const { isActive } = this.state;
        // tslint:disable-next-line: no-console
        // console.log(buildPath(baseURL, currentLanguage));
        return (
            <React.Fragment>
                {!['/confirm'].some(r => location.pathname.includes(r)) && (
                    <header className={`pg-header ${isActive ? 'pg-header--active' : ''}`}>
                        <div className="pg-container pg-header__content">
                            <div className="pg-header__navbar">
                                <NavBar onLinkChange={this.closeMenu} />
                            </div>
                        </div>
                    </header>
                )}
            </React.Fragment>
        );
    }

    private closeMenu = (e: any) => {
        this.setState({
            isActive: false,
        });
        this.props.setMobileWalletUi('');
    };

    private handleOutsideClick = (e: any) => {
        if (e.offsetX > e.target.clientWidth) {
            this.setState({
                isActive: false,
            });
            document.getElementsByClassName('pg-header__navbar')[0].removeEventListener('click', this.handleOutsideClick);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    currentLanguage: selectCurrentLanguage(state),
    mobileWallet: selectMobileWalletUi(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
});

const Header = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Head) as any) as any;

export { HeaderState, Header };
