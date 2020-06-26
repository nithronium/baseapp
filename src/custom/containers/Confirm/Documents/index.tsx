import {
  Button,
  Dropdown,
  Loader,
} from '@openware/components';
import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import MaskInput from 'react-maskinput';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import {withRouter} from 'react-router';
import close = require('../../../../assets/images/close.svg');
import { formatDate } from '../../../../helpers';
import { isDateInFuture } from '../../../../helpers/checkDate';
import {
    alertPush,
    labelFetch,
    RootState,
    selectUserInfo,
    User,
} from '../../../../modules';
import {
    selectSendDocumentsLoading,
    selectSendDocumentsSuccess,
    sendDocuments,
} from '../../../../modules/user/kyc/documents';
import {changeUserLevel} from '../../../../modules/user/profile';
import {handleRedirectToConfirm} from '../../../helpers';
import {isValidDate} from '../../../helpers/checkDate';

interface ReduxProps {
    success?: string;
    loading: boolean;
    user: User;
}

interface DispatchProps {
    changeUserLevel: typeof changeUserLevel;
    sendDocuments: typeof sendDocuments;
    fetchAlert: typeof alertPush;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface HistoryProps {
    history: History;
}

interface DocumentsState {
    documentsType: string;
    expiration: string;
    expirationFocused: boolean;
    expirationValid: boolean;
    scans: File[];
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps & HistoryProps;

// tslint:disable:member-ordering
class DocumentsComponent extends React.Component<Props, DocumentsState> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public data = [
        this.translate('page.body.kyc.documents.select.utilityBill'),
        this.translate('page.body.kyc.documents.select.bankStatement'),
        this.translate('page.body.kyc.documents.select.taxCertificate'),
        this.translate('page.body.kyc.documents.select.leaseOfRentalAgreement'),
    ];

    public state = {
        documentsType: '',
        expiration: '',
        expirationFocused: false,
        expirationValid: false,
        scans: [],
    };

    public componentWillReceiveProps(next: Props) {
        const { user } = this.props;

        if (next.success) {
            this.props.changeUserLevel({ level: +user.level + 1 });
            this.props.labelFetch();
        }
    }

    public backBtn = () => handleRedirectToConfirm('addressStep', this.props.history);

    public render() {
        const {
            documentsType,
            expiration,
            expirationFocused,
            scans,
        }: DocumentsState = this.state;

        const { loading } = this.props;

        const expirationFocusedClass = cr('pg-confirm__content-documents-col-row-content', {
            'pg-confirm__content-documents-col-row-content--focused': expirationFocused,
        });

        const onSelect = value => this.handleChangeDocumentsType(this.data[value]);

        return (
            <React.Fragment>
                <div className="pg-confirm__content-documents">
                    <div className="pg-confirm__content-documents-col-row">
                        <div className="pg-confirm__content-documents-col">
                            <div className="pg-confirm__content-documents-col-row">
                                <div className="pg-confirm__content-documents-col-row-content-3">
                                    <div className="pg-confirm__content-documents-col-row-content-label">
                                        {documentsType && this.translate('page.body.kyc.documentsType')}
                                    </div>
                                    <Dropdown
                                        className="pg-confirm__content-documents-col-row-content-number"
                                        list={this.data}
                                        placeholder={this.translate('page.body.kyc.documentsType')}
                                        onSelect={onSelect}
                                        elemHeight={40}
                                        listHeight={160}
                                    />
                                </div>
                                <fieldset className={expirationFocusedClass}>
                                    {expiration && <legend>{this.translate('page.body.kyc.documents.expiryDate')}</legend>}
                                    <MaskInput
                                      maskString="00/00/0000"
                                      mask="00/00/0000"
                                      onChange={this.handleChangeExpiration}
                                      onFocus={this.handleFieldFocus('expiration')}
                                      onBlur={this.handleFieldFocus('expiration')}
                                      value={expiration}
                                      className="group-input"
                                      placeholder={this.translate('page.body.kyc.documents.expiryDate')}
                                    />
                                </fieldset>
                            </div>
                        </div>
                        <div className="pg-confirm__loader">
                            {loading ? <Loader /> : null}
                        </div>
                        <div className="pg-confirm__content-documents-col pg-confirm__content-documents-drag">
                            <div className="pg-confirm__content-documents-col-row">
                                <div className="pg-confirm__content-documents-col-row-content-2">
                                    {this.translate('page.body.kyc.documents.upload')}
                                    <div className="pg-confirm__content-documents-col-row-content-2-documents">
                                        <form
                                            className="box"
                                            draggable={true}
                                            onDrop={this.handleFileDrop}
                                            onDragOver={this.handleDragOver}
                                            method="post"
                                            action=""
                                            data-enctype="multipart/form-data"
                                        >
                                            <input
                                                className="pg-confirm__content-documents-col-row-content-2-documents-input"
                                                data-multiple-caption="files selected"
                                                draggable={true}
                                                multiple={true}
                                                name="files[]"
                                                type="file"
                                                id="file"
                                                onChange={this.handleUploadScan}
                                            />
                                            <div className="pg-confirm__content-documents-col-row-content-2-documents-label">
                                                <label
                                                    className="pg-confirm__content-documents-col-row-content-2-documents-label-item"
                                                    htmlFor="file"
                                                >
                                                    <p className="active">{this.translate('page.body.kyc.documents.drag')}</p>
                                                    <div className="muted">{this.translate('page.body.kyc.documents.maxFile')}</div>
                                                    <div className="muted">{this.translate('page.body.kyc.documents.maxNum')}</div>
                                                </label>
                                            </div>
                                        </form>
                                    </div>
                                    <span className="pg-confirm__content-documents-col-row-content-2__expiration">
                                        {this.translate('page.body.kyc.documents.expiration')}
                                    </span>
                                    {Array.from(scans).map(this.renderScan)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-deep-back"
                        label={this.translate('page.body.kyc.back')}
                        onClick={this.backBtn}
                    />
                    <div className="pg-confirm__content-deep-margin" />
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label={this.translate('page.body.kyc.next')}
                        onClick={this.sendDocuments}
                        disabled={this.handleCheckButtonDisabled()}
                    />
                </div>
            </React.Fragment>
        );
    }

    private handleChangeDocumentsType = (value: string) => {
        this.setState({
            documentsType: value,
        });
    };

    private handleFileDelete = (key: number) => () => {
        const fileList = Array.from(this.state.scans);
        fileList.splice(key, 1);
        this.setState({
            scans: fileList,
        });
    }

    private renderScan = (scan: File, index: number) => {
        return (
            <div
                className="pg-confirm__content-documents-filename"
                key={index}
                onClick={this.handleFileDelete(index)}
            >
                {scan.name.slice(0, 27)}...&nbsp;
                <img src={close}/>
            </div>
        );
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'expiration':
                    this.setState({
                        expirationFocused: !this.state.expirationFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private handleChangeExpiration = (e: OnChangeEvent) => {
        this.setState({
            expiration: formatDate(e.target.value),
        });

        const expirationMaxLength = 10;

        if (e.target.value.length === expirationMaxLength) {
            const currentDate = new Date();
            const dateToCompare = currentDate.setMonth(currentDate.getMonth() - 3);

            if (isValidDate(formatDate(e.target.value), dateToCompare) && !isDateInFuture(formatDate(e.target.value))) {
                this.setState({
                    expirationValid: true,
                });
            } else {
                this.props.fetchAlert({ message: ['resource.documents.expirationDate'], type: 'error'});
                this.setState({
                    expirationValid: false,
                });
            }
        }
    }

    private handleUploadScan = uploadEvent => {
        const allFiles: File[] = uploadEvent.target.files;
        const oldFileList = Array.from(this.state.scans);
        const documentsCount = 5;
        const additionalFileList = Array.from(allFiles).length > documentsCount ?  Array.from(allFiles).slice(0,documentsCount) : Array.from(allFiles);
        if (oldFileList.length + additionalFileList.length <= documentsCount) {
            this.setState({ scans: additionalFileList.concat(oldFileList) });
        } else {
            this.setState({ scans: additionalFileList.concat(oldFileList).slice(0,documentsCount) });
            this.props.fetchAlert({ message: ['resource.documents.limit_reached'], type: 'error'});
        }
    }
    private handleFileDrop = event => {
      event.preventDefault();
      event.stopPropagation();
      const uploadObj = {
          target: event.nativeEvent.dataTransfer,
      };
      this.handleUploadScan(uploadObj);
    }

    private handleDragOver = event => {
      event.preventDefault();
      event.stopPropagation();
    }

    private handleCheckButtonDisabled = () => {
        const { expiration, expirationValid, scans } = this.state;

        return !scans.length || !expiration || !expirationValid;
    }

    private sendDocuments = () => {
        const {
            scans,
            expiration,
            documentsType,
        }: DocumentsState = this.state;

        const typeOfDocuments = this.getDocumentsType(documentsType);

        if (!scans.length) {
            return;
        }

        const request = new FormData();

        for (const scan of scans) {
            request.append('upload[]', scan);
        }
        request.append('doc_expire', expiration);
        request.append('doc_number', '0000');
        request.append('doc_type', typeOfDocuments);

        this.props.sendDocuments(request);
    };

    private getDocumentsType = (value: string) => {
        switch (value) {
           case this.data[0]: return 'Utility bill';
           case this.data[1]: return 'Bank statement';
           case this.data[2]: return 'Tax certificate';
           case this.data[3]: return 'Lease of rental agreement';
           default: return value;
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    success: selectSendDocumentsSuccess(state),
    loading: selectSendDocumentsLoading(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        fetchAlert: payload => dispatch(alertPush(payload)),
        sendDocuments: payload => dispatch(sendDocuments(payload)),
        labelFetch: () => dispatch(labelFetch()),
    });

// tslint:disable-next-line:no-any
export const Documents = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(DocumentsComponent) as any));
