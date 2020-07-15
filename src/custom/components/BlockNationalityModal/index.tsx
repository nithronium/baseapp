import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface OwnProps {
    toggleModal: () => void;
    className?: string;
}

type Props = InjectedIntlProps & OwnProps;

class DeniedModal extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        return(
            <div className={this.props.className}>
                <div className="pg-denied__body">
                    <div className="pg-denied__body-box">
                        <div className="pg-denied__body__header">
                            <div>{this.translate('page.body.modal.blockNationality.header')}</div>
                        </div>
                        <div className="pg-denied__body__content">
                            <div className="pg-denied__body__content__message">
                                {this.translate('page.body.modal.blockNationality.message')}
                            </div>
                            <div className="pg-denied__body__content__back-kyc" onClick={this.handleClick}>
                                {this.translate('page.body.modal.blockNationality.button')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleClick = () => {
        this.props.toggleModal();
    };
}

export const BlockNationalityModal = injectIntl(DeniedModal);
