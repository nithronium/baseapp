import { Button, Dropdown } from '@openware/components';
import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {checkQuestionnaire} from '../../../../helpers';
import {
    Label,
    labelFetch,
    RootState,
    selectLabelData,
    selectUserInfo,
    User,
} from '../../../../modules';
import { changeUserLevel } from '../../../../modules/user/profile';
import {
    dataStoragePush,
    selectDataStoragePushSuccess,
} from '../../../modules/user/dataStorage';
import { DataStorageItemInterface } from '../../../modules/user/dataStorage/types';

import { redirect, redirectIfSpecified } from '../../../helpers';

import { removeQuestionnaire } from '../../../../api';

interface ReduxProps {
    dataStoragePushSuccess: boolean;
    user: User;
    label: Label[];
}

interface HistoryProps {
    history: History;
}

interface DispatchProps {
    pushDataStorage: typeof dataStoragePush;
}

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps & RouterProps;

const answersForQuestion1 = translate => [
    translate('page.body.kyc.questionnaire.question1.answer1'),
    translate('page.body.kyc.questionnaire.question1.answer2'),
];

const answersForQuestion2 = translate => [
    translate('page.body.kyc.questionnaire.question2.answer1'),
    translate('page.body.kyc.questionnaire.question2.answer2'),
    translate('page.body.kyc.questionnaire.question2.answer3'),
];

const answersForQuestion3 = translate => [
    translate('page.body.kyc.questionnaire.question3.answer1'),
    translate('page.body.kyc.questionnaire.question3.answer2'),
    translate('page.body.kyc.questionnaire.question3.answer3'),
];

const answersForQuestion5 = translate => [
    translate('page.body.kyc.questionnaire.question5.answer1'),
    translate('page.body.kyc.questionnaire.question5.answer2'),
];

const answersForQuestion6 = translate => [
    translate('page.body.kyc.questionnaire.question6.answer1'),
    translate('page.body.kyc.questionnaire.question6.answer2'),
    translate('page.body.kyc.questionnaire.question6.answer3'),
    translate('page.body.kyc.questionnaire.question6.answer4'),
    translate('page.body.kyc.questionnaire.question6.answer5'),
    translate('page.body.kyc.questionnaire.question6.answer6'),
];

const answersForQuestion7 = translate => [
    translate('page.body.kyc.questionnaire.question7.answer1'),
    translate('page.body.kyc.questionnaire.question7.answer2'),
    translate('page.body.kyc.questionnaire.question7.answer3'),
    translate('page.body.kyc.questionnaire.question7.answer4'),
    translate('page.body.kyc.questionnaire.question7.answer5'),
];

const answersForQuestion8 = translate => [
    translate('page.body.kyc.questionnaire.question8.answer1'),
    translate('page.body.kyc.questionnaire.question8.answer2'),
    translate('page.body.kyc.questionnaire.question8.answer3'),
];

const answersForQuestion9 = translate => [
    translate('page.body.kyc.questionnaire.question9.answer1'),
    translate('page.body.kyc.questionnaire.question9.answer2'),
    translate('page.body.kyc.questionnaire.question9.answer3'),
];

const answersForQuestion10 = translate => [
    translate('page.body.kyc.questionnaire.question10.answer1'),
    translate('page.body.kyc.questionnaire.question10.answer2'),
    translate('page.body.kyc.questionnaire.question10.answer3'),
    translate('page.body.kyc.questionnaire.question10.answer4'),
];

const answersForQuestion11 = translate => [
    translate('page.body.kyc.questionnaire.question11.answer1'),
    translate('page.body.kyc.questionnaire.question11.answer2'),
];

const answersForQuestion12 = translate => [
    translate('page.body.kyc.questionnaire.question12.answer1'),
    translate('page.body.kyc.questionnaire.question12.answer2'),
];

interface QuestionnaireItem {
    key: string;
    value: string;
}

interface State {
    questionnaire: QuestionnaireItem[];
    inputEmployerFocused: boolean;
    inputPositionFocused: boolean;
    inputCommentFocused: boolean;
}

// tslint:disable:jsx-no-lambda
class QuestionnaireContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            questionnaire: [],
            inputEmployerFocused: false,
            inputPositionFocused: false,
            inputCommentFocused: false,
        };
    }

    public componentDidMount() {
        this.props.labelFetch();
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { dataStoragePushSuccess, user } = this.props;
        if (nextProps.label && checkQuestionnaire(nextProps.label)) {
            redirect(() => this.props.history.push(redirectIfSpecified('/profile')));
        }
        // tslint:disable-next-line:no-console
        console.log('...........nextProps.dataStoragePushSuccess && !dataStoragePushSuccess', nextProps.dataStoragePushSuccess, !dataStoragePushSuccess);
        if (nextProps.dataStoragePushSuccess && !dataStoragePushSuccess) {
            // this.props.labelFetch();
            // tslint:disable-next-line
            removeQuestionnaire({ uid: user.uid });
            redirect(() => this.props.history.push(redirectIfSpecified('/profile')));
        }
    }

    public renderDropdownItem(title: string, answers: string[]) {
        return (
            <div className="pg-questionnaire__list__dropdown-item">
                <span className="pg-questionnaire__list__dropdown-item__title">{title}</span>
                <Dropdown
                    className="pg-questionnaire__list__dropdown-item__dropdown"
                    list={answers}
                    onSelect={index => this.handleSelectDropdownAnswer(title, answers[index])}
                    placeholder={this.translate('page.body.kyc.questionnaire.dropDown.placeholder')}
                />
            </div>
        );
    }

    public renderDoubleInputItem(question: string) {
        const {
            inputEmployerFocused,
            inputPositionFocused,
            questionnaire,
        } = this.state;

        const targetQuestionIndex = questionnaire.findIndex(item => item.key === question);
        let targetQuestionValues = '';

        if (targetQuestionIndex !== -1) {
            targetQuestionValues = questionnaire[targetQuestionIndex].value;
        }

        const targetQuestionValuesSep = targetQuestionValues.split(',');
        const numOfAnswerParts = 2;
        const inputEmployerPart = 1;
        const inputPositionPart = 2;

        const inputEmployerClass = cr('pg-questionnaire__list__double-input-item__fieldset', {
            'pg-questionnaire__list__double-input-item__fieldset--focused': inputEmployerFocused,
            'pg-questionnaire__list__double-input-item__fieldset--wrong':
                targetQuestionValuesSep[inputEmployerPart - 1] &&
                !this.handleValidateInput('input', targetQuestionValuesSep[inputEmployerPart - 1]),
        });

        const inputPositionClass = cr('pg-questionnaire__list__double-input-item__fieldset', {
            'pg-questionnaire__list__double-input-item__fieldset--focused': inputPositionFocused,
            'pg-questionnaire__list__double-input-item__fieldset--wrong':
                targetQuestionValuesSep[inputPositionPart - 1] &&
                !this.handleValidateInput('input', targetQuestionValuesSep[inputPositionPart - 1]),
        });

        return (
            <div className="pg-questionnaire__list__double-input-item">
                <span className="pg-questionnaire__list__double-input-item__title">{question}</span>
                <fieldset className={inputEmployerClass}>
                    {targetQuestionValuesSep[inputEmployerPart - 1] && <legend>{this.translate('page.body.kyc.questionnaire.question4.input1')}</legend>}
                        <input
                            className="pg-questionnaire__list__double-input-item__fieldset__input"
                            type="string"
                            placeholder={this.translate('page.body.kyc.questionnaire.question4.input1')}
                            value={targetQuestionValuesSep[inputEmployerPart - 1] || ''}
                            onChange={event => this.handleSetQuestionnaireItem(question, event.target.value, numOfAnswerParts, inputEmployerPart)}
                            onFocus={() => this.handleChangeFieldFocus(`inputEmployerFocused`)}
                            onBlur={() => this.handleChangeFieldFocus(`inputEmployerFocused`)}
                        />
                </fieldset>
                <fieldset className={inputPositionClass}>
                    {targetQuestionValuesSep[inputPositionPart - 1] && <legend>{this.translate('page.body.kyc.questionnaire.question4.input2')}</legend>}
                        <input
                            className="pg-questionnaire__list__double-input-item__fieldset__input"
                            type="string"
                            placeholder={this.translate('page.body.kyc.questionnaire.question4.input2')}
                            value={targetQuestionValuesSep[inputPositionPart - 1] || ''}
                            onChange={event => this.handleSetQuestionnaireItem(question, event.target.value, numOfAnswerParts, inputPositionPart)}
                            onFocus={() => this.handleChangeFieldFocus(`inputPositionFocused`)}
                            onBlur={() => this.handleChangeFieldFocus(`inputPositionFocused`)}
                        />
                </fieldset>
            </div>
        );
    }

    public renderTextareaItem(question: string, key: string) {
        const {
            questionnaire,
        } = this.state;

        const targetQuestionIndex = questionnaire.findIndex(item => item.key === question);
        let targetQuestionValue = '';

        if (targetQuestionIndex !== -1) {
            targetQuestionValue = questionnaire[targetQuestionIndex].value;
        }

        const inputTextareaItemClass = cr('pg-questionnaire__list__textarea-item', {
            'pg-questionnaire__list__textarea-item--focused': this.state[`inputCommentFocused-${key}`],
            'pg-questionnaire__list__textarea-item--wrong':
                targetQuestionValue &&
                !this.handleValidateInput('textarea', targetQuestionValue),
        });

        return (
            <div className={inputTextareaItemClass}>
                <span className="pg-questionnaire__list__textarea-item__title">{question}</span>
                {targetQuestionValue && <legend>{this.translate('page.body.kyc.questionnaire.question13.textarea')}</legend>}
                <textarea
                    className="pg-questionnaire__list__textarea-item__textarea"
                    placeholder={this.translate('page.body.kyc.questionnaire.question13.textarea')}
                    value={targetQuestionValue || ''}
                    onChange={event => this.handleSetQuestionnaireItem(question, event.target.value)}
                    onFocus={() => this.handleChangeFieldFocus(`inputCommentFocused-${key}`)}
                    onBlur={() => this.handleChangeFieldFocus(`inputCommentFocused-${key}`)}
                />
            </div>
        );
    }

    public renderQuestions() {
        return (
            <div className="pg-questionnaire__list">
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question1'), answersForQuestion1(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question2'), answersForQuestion2(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question3'), answersForQuestion3(this.translate))}
                {this.renderTextareaItem(this.translate('page.body.kyc.questionnaire.question3.1'), '3.1')}
                {this.renderTextareaItem(this.translate('page.body.kyc.questionnaire.question3.2'), '3.2')}
                {this.renderTextareaItem(this.translate('page.body.kyc.questionnaire.question3.3'), '3.3')}
                {this.renderTextareaItem(this.translate('page.body.kyc.questionnaire.question3.4'), '3.4')}
                {this.renderDoubleInputItem(this.translate('page.body.kyc.questionnaire.question4'))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question5'), answersForQuestion5(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question6'), answersForQuestion6(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question7'), answersForQuestion7(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question8'), answersForQuestion8(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question9'), answersForQuestion9(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question10'), answersForQuestion10(this.translate))}
                {this.renderTextareaItem(this.translate('page.body.kyc.questionnaire.question10.1'), '10.1')}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question11'), answersForQuestion11(this.translate))}
                {this.renderDropdownItem(this.translate('page.body.kyc.questionnaire.question12'), answersForQuestion12(this.translate))}
                {this.renderTextareaItem(this.translate('page.body.kyc.questionnaire.question13'), '13')}
            </div>
        );
    }

    public render() {
        const { questionnaire } = this.state;

        return (
            <div className="pg-questionnaire">
                <div>
                    <span className="pg-questionnaire__title">{this.translate('page.body.kyc.questionnaire.title')}</span>
                    {this.renderQuestions()}
                    <div className="pg-questionnaire__button">
                        <Button
                            className="pg-questionnaire__button__item"
                            label={this.translate('page.body.kyc.confirm')}
                            onClick={this.handleClickConfirm}
                            disabled={questionnaire.length !== 18 || !this.handleValidateQuestionnaire(questionnaire)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleClickConfirm = () => {
        const { questionnaire } = this.state;

        if (questionnaire.length) {
            const formattedQuestionnaireData = questionnaire.map(question =>
                `${JSON.stringify(question.key)}:${JSON.stringify(question.value)}`,
            ).join(',');

            const dataToUpload: DataStorageItemInterface = {
                title: 'questionnaire',
                data: `{${formattedQuestionnaireData}}`,
            };

            this.props.pushDataStorage(dataToUpload);
        }
    };

    private handleChangeFieldFocus = (key: string) => {
        // @ts-ignore
        this.setState(prev => ({
            [key]: !prev[key],
        }));
    };

    private handleSelectDropdownAnswer = (question: string, answer: string) => {
        this.handleSetQuestionnaireItem(question, answer);
    }

    private handleSetQuestionnaireItem = (question: string, answer: string, parts?: number, partToSet?: number) => {
        const { questionnaire } = this.state;
        const itemToSet = questionnaire.findIndex(item => item.key === question);
        let answerToSet = answer;

        if (itemToSet !== -1) {
            const updatedQuestionnaire = questionnaire;

            if (parts && partToSet) {
                const answerToSetArray = updatedQuestionnaire[itemToSet].value.split(',');
                answerToSetArray[partToSet - 1] = answer;
                answerToSet = answerToSetArray.join(',');
            }

            updatedQuestionnaire[itemToSet].value = answerToSet;
            this.setState({ questionnaire: updatedQuestionnaire });
        } else {
            const updatedQuestionnaire = questionnaire;

            if (parts && partToSet) {
                answerToSet = '';
                for (let i = 0; i < parts - 1; i++) {
                    answerToSet = `${answerToSet},`;
                }

                const answerToSetArray = answerToSet.split(',');
                answerToSetArray[partToSet - 1] = answer;
                answerToSet = answerToSetArray.join(',');
            } else {
                answerToSet = answer;
            }

            updatedQuestionnaire.push({ key: question, value: answerToSet });
            this.setState({ questionnaire: updatedQuestionnaire });
        }
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'input':
                const inputRegex = new RegExp(`^[a-zA-Zа-яА-Я \-]{1,100}$`);
                return value.match(inputRegex) ? true : false;
            case 'textarea':
                const textareaRegex = new RegExp(`^[a-zA-Zа-яА-Я0-9 \-,.;/\\s]+$`);
                return value.match(textareaRegex) ? true : false;
            default:
                return true;
        }
    };

    private translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };


    private handleValidateQuestionnaire = (questionnaire: QuestionnaireItem[]) => {
        let inputEmployerValid = false;
        let inputPositionValid = false;
        let inputCommentValid = false;
        const question4 = this.translate('page.body.kyc.questionnaire.question4');
        const targetQuestionIndex = questionnaire.findIndex(item => item.key === question4);
        let targetQuestionValues = '';

        if (targetQuestionIndex !== -1) {
            targetQuestionValues = questionnaire[targetQuestionIndex].value;
            const targetQuestionValuesSep = targetQuestionValues.split(',');
            inputEmployerValid = this.handleValidateInput('input', targetQuestionValuesSep[0]);
            inputPositionValid = this.handleValidateInput('input', targetQuestionValuesSep[1]);
        }

        const question13 = this.translate('page.body.kyc.questionnaire.question13');
        const targetQuestionIndex13 = questionnaire.findIndex(item => item.key === question13);
        let targetQuestionValue13 = '';

        if (targetQuestionIndex13 !== -1) {
            targetQuestionValue13 = questionnaire[targetQuestionIndex13].value;
            inputCommentValid = this.handleValidateInput('textarea', targetQuestionValue13);
        }

        return inputEmployerValid && inputPositionValid && inputCommentValid;
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    dataStoragePushSuccess: selectDataStoragePushSuccess(state),
    user: selectUserInfo(state),
    label: selectLabelData(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        pushDataStorage: payload => dispatch(dataStoragePush(payload)),
        labelFetch: () => dispatch(labelFetch()),
    });

// tslint:disable-next-line
export const Questionnaire = withRouter(injectIntl(connect(mapStateToProps, mapDispatchProps)(QuestionnaireContainer) as any));
