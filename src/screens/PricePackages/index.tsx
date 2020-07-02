import Slider from 'infinite-react-carousel';
import * as React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { checkQuestionnaire } from '../../helpers';
import {
    alertPush,
    RootState,
    selectLabelData,
    selectUserInfo,
} from '../../modules';

const kycLevels = [
    {
        title: 'page.kyc.levels.block.1.title',
        img: 'starter-icon.svg',
        limitPlank: 'page.kyc.levels.block.1.limit-plank',
        headerInfo: 'page.kyc.levels.block.1.header-info',
        headerInfoItems: ['page.kyc.levels.block.1.header-info.item1', 'page.kyc.levels.block.1.header-info.item2'],
        depositLimits: {
            crypto: ['€15 000', '€1 000'],
            flat: ['€15 000', '€1 000'],
        },
        withdrawalLimits: {
            crypto: ['€15 000', '€1 000'],
            flat: ['€15 000', '€1 000'],
        },
        requirementsItems: ['page.kyc.levels.block.1.requirements.item1',
            'page.kyc.levels.block.1.requirements.item2',
            'page.kyc.levels.block.1.requirements.item3',
            'page.kyc.levels.block.1.requirements.item4',
            'page.kyc.levels.block.1.requirements.item5',
            'page.kyc.levels.block.1.requirements.item6',
        ],
    },
    {
        title: 'page.kyc.levels.block.2.title',
        limitPlank: 'page.kyc.levels.block.2.limit-plank',
        img: 'expert-icon.svg',
        headerInfo: 'page.kyc.levels.block.2.header-info',
        headerInfoItems: ['page.kyc.levels.block.2.header-info.item1', 'page.kyc.levels.block.2.header-info.item2', 'page.kyc.levels.block.2.header-info.item3'],
        depositLimits: {
            crypto: ['€100 000', '€15 000'],
            flat: ['€100 000', '€15 000'],
        },
        withdrawalLimits: {
            crypto: ['€100 000', '€15 000'],
            flat: ['€100 000', '€15 000'],
        },
        requirementsItems: ['page.kyc.levels.block.2.requirements.item1', 'page.kyc.levels.block.2.requirements.item2'],
    },
    {
        title: 'page.kyc.levels.block.3.title',
        limitPlank: 'page.kyc.levels.block.3.limit-plank',
        img: 'master-icon.svg',
        headerInfo: 'page.kyc.levels.block.3.header-info',
        headerInfoItems: ['page.kyc.levels.block.3.header-info.item1', 'page.kyc.levels.block.3.header-info.item2', 'page.kyc.levels.block.3.header-info.item3'],
        depositLimits: {
            crypto: ['Unlimited', 'Unlimited'],
            flat: ['Unlimited', 'Unlimited'],
        },
        withdrawalLimits: {
            crypto: ['Unlimited', 'Unlimited'],
            flat: ['Unlimited', 'Unlimited'],
        },
        requirementsItems: ['page.kyc.levels.block.3.requirements.item1', 'page.kyc.levels.block.3.requirements.item2'],
    },
];

// @ts-ignore
const PricePackages = props => {
    const widthPage = React.useRef(null);
    const [clientWidth, setClientWidth] = React.useState(1000);
    React.useEffect(() => {
        // @ts-ignore
        setClientWidth(widthPage.current.clientWidth);
    }, []);
    const userLevel = props.user.level;
    const kycBlock = (info, key, isCompleted) => (
        <div key={key} className="carousel-block__block">
        <div className="carousel-block__header">
            <span className="carousel-block__header-text">
                {props.intl.formatMessage({id: info.title})}
                {isCompleted}
            </span>
            <div className="carousel-block__limits-block">
                <span className="limits-text"> {props.intl.formatMessage({id: info.limitPlank})}</span>
                <img src={require(`./${info.img}`)} alt="StarterIcon"/>
            </div>
        </div>
        <div className="carousel-block__body">
            <div className="carousel-block__description-block">
                <span className="description-header">{props.intl.formatMessage({id: info.headerInfo})}:</span>
                <ul className="description-list">
                    {info.headerInfoItems.map((item, index) => (<li key={`description-${key}-${index}`} className="description-list__item">{props.intl.formatMessage({id: item})}</li>))}
                </ul>
            </div>
            <div className="limits-block">
                <div className="limits-block__header">
                    <span className="limits-block__white-text">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.header'})}</span>
                    <span className="limits-block__yellow-text">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.deposit'})}</span>
                </div>
                <div className="limits-block__table">
                    <div className="limits-block__row limits-block__header-row">
                        <div className="limits-block__cell"/>
                        <div className="limits-block__cell">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.eu'})}</div>
                        <div className="limits-block__cell">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.non-eu'})}</div>
                    </div>
                    <div className="limits-block__row">
                        <div className="limits-block__cell">
                            <img src={require('./bitcoin-buy.svg')} alt=""/>
                            <span className="limits-block__img-text">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.crypto'})}</span>
                        </div>
                        {info.depositLimits.crypto.map((item, index) => (<div key={`deposit1-${key}-${index}`} className="limits-block__cell">{item}</div>))}
                    </div>
                    <div className="limits-block__row">
                        <div className="limits-block__cell">
                            <img src={require('./dollar-buy.svg')} alt=""/>
                            <span className="limits-block__img-text">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.flat'})}</span>
                        </div>
                        {info.depositLimits.flat.map((item, index) => (<div key={`withdrawal1-${key}-${index}`} className="limits-block__cell">{item}</div>))}
                    </div>
                </div>
            </div>
            <div className="limits-block">
                <div className="limits-block__header">
                    <span className="limits-block__white-text">Monthly</span>
                    <span className="limits-block__yellow-text">Withdrawal Limits</span>
                </div>
                <div className="limits-block__table">
                    <div className="limits-block__row limits-block__header-row">
                        <div className="limits-block__cell"/>
                        <div className="limits-block__cell">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.eu'})}</div>
                        <div className="limits-block__cell">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.non-eu'})}</div>
                    </div>
                    <div className="limits-block__row">
                        <div className="limits-block__cell">
                            <img src={require('./bitcoin-sell.svg')} alt=""/>
                            <span className="limits-block__img-text">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.crypto'})}</span>
                        </div>
                        {info.withdrawalLimits.crypto.map((item, index) => (<div key={`deposit2-${key}-${index}`} className="limits-block__cell">{item}</div>))}
                    </div>
                    <div className="limits-block__row">
                        <div className="limits-block__cell">
                            <img src={require('./dollar-sell.svg')} alt=""/>
                            <span className="limits-block__img-text">{props.intl.formatMessage({id: 'page.kyc.levels.block.limits.flat'})}</span>
                        </div>
                        {info.withdrawalLimits.flat.map((item, index) => (<div key={`withdrawal2-${key}-${index}`} className="limits-block__cell">{item}</div>))}
                    </div>
                </div>
            </div>
            <div className="carousel-block__description-block">
                <div className="description-header requirement">{props.intl.formatMessage({id: 'page.kyc.levels.block.requirements.title'})}</div>
                <ul className="description-list">
                    {info.requirementsItems.map((item, index) => (<li key={`requirements-${key}-${index}`} className="description-list__item"><div dangerouslySetInnerHTML={{__html: `${props.intl.formatMessage({id: item})}`}}/></li>))}
                </ul>
            </div>
            {!isCompleted
                ? userLevel === 5
                 ?  <Link to={checkQuestionnaire(props.labels) ? '/profile' : '/confirm'} className={`carousel-block__btn-block green`}>
                        {props.intl.formatMessage({id: props.selectDataStorageAlready === 'false' ? 'page.kyc.levels.block.btn.uncompleted' : 'page.kyc.levels.block.btn.inprogress'})}
                    </Link>
                    : <Link to={'/confirm'} className={`carousel-block__btn-block green`}>
                        {props.intl.formatMessage({id: 'page.kyc.levels.block.btn.uncompleted'})}
                    </Link>
                : <div className={`carousel-block__btn-block yellow`}>
                    {props.intl.formatMessage({id: 'page.kyc.levels.block.btn.completed'})}
                </div>
            }
        </div>
    </div>);
    const isCompletedLevel = index => {
        switch (index) {
            case 0: return userLevel >= 4;
            case 1: return userLevel >= 5;
            case 2: return userLevel > 5;
            default: return true;
        }
    };
    return (
        <div ref={widthPage} className="price-package">
            <span className="price-package__title">{props.intl.formatMessage({id: 'page.kyc.levels.title'})}</span>
            <div className="carousel-block">
                {clientWidth > 980
                    ? <React.Fragment>
                       {kycLevels.map((item, index) => kycBlock(item, `block-${index}`, isCompletedLevel(index)))}
                    </React.Fragment>
                    :
                    <Slider
                        dots={true}
                        arrows={true}
                        autoplay={false}
                        duration={100}
                        autoplaySpeed={8000}
                        slidesToShow={1}
                        centerPadding={0}
                        pauseOnHover={false}
                    >
                        {kycLevels.map((item, index) => kycBlock(item, `block-${index}`, isCompletedLevel(index)))}
                    </Slider>
                }
            </div>
        </div>);
};

export const PricePackagesScreen = injectIntl(connect(
    (state: RootState) => ({
        user: selectUserInfo(state),
        label: selectLabelData(state),
    }),
    dispatch => ({fetchWaitingQuestionnaire: payload => dispatch(alertPush(payload))}),
    )(PricePackages));
