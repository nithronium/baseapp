import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSelector } from 'react-redux';
import { GeetestCaptcha } from '../../containers';
import { useGeetestCaptchaSuccess, useRecaptchaSuccess, useSetShouldGeetestReset } from '../../hooks';
import { selectConfigs, selectShouldGeetestReset } from '../../modules';

export const CaptchaComponent = props => {
    const configs = useSelector(selectConfigs);
    const shouldGeetestReset = useSelector(selectShouldGeetestReset);

    let reCaptchaRef;

    reCaptchaRef = React.useRef();
    const geetestCaptchaRef = React.useRef(null);

    React.useEffect(() => {
        if (props.error || props.success) {
            if (reCaptchaRef.current) {
                reCaptchaRef.current.reset();
            }
            if (geetestCaptchaRef) {
                useSetShouldGeetestReset(true);
            }
        }
    }, [props.error, props.success]);

    const renderCaptcha = () => {
        switch (configs.captcha_type) {
            case 'recaptcha':
                return (
                    <div className="pg-captcha--recaptcha">
                        <ReCAPTCHA
                            ref={reCaptchaRef}
                            sitekey={configs.captcha_id}
                            onChange={useRecaptchaSuccess}
                        />
                    </div>
                );
            case 'geetest':
                return (
                    <div className="pg-captcha--geetest">
                        <GeetestCaptcha
                            ref={geetestCaptchaRef}
                            shouldCaptchaReset={shouldGeetestReset}
                            onSuccess={useGeetestCaptchaSuccess}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return renderCaptcha();
};

export const Captcha = React.memo(CaptchaComponent);
