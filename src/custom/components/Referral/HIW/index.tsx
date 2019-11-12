import * as React from 'react';

interface Step {
    h3: string;
    h4Green: string;
    h4Rest: string;
    text: string;
}
//tslint:disable
const step = (data: Step) => {
    return (
        <div className="step">
            <h3 style={{ display: 'inline-block' }}>
                <span>{data.h3}</span>
            </h3>{' '}
            {data.h3 === 'Step 2' && (
                <span style={{ fontSize: '16px', color: '#c3a026', paddingLeft: '10px' }}>
                    <b>(COMING SOON)</b>
                </span>
            )}
            <h4>
                <span className="green">{data.h4Green}</span>
                {data.h4Rest}
            </h4>
            <p>{data.text}</p>
        </div>
    );
};

const steps = [
    {
        h3: 'Step 1',
        h4Green: 'Create',
        h4Rest: ' an account using a referral code.',
        text:
            'Once your account is set up, you’ll receive your own referral code to share. You’ll also receive your first ticket for the draw!',
    },
    {
        h3: 'Step 2',
        h4Green: 'Share, Follow & Top up',
        h4Rest: ' for tickets!',
        text:
            'You’ll receive 2 tickets for everyone you refer and 1 ticket for everyone they refer. Plus tickets for social media follows and balance topups! ',
    },
    {
        h3: 'Step 3',
        h4Green: 'Activate',
        h4Rest: ' tickets on Emirex.com.',
        text:
            'All tickets are initially set as ‘pending’. For a ticket to count toward the draw, it must be activated. Activate and win with Emirex!',
    },
    {
        h3: 'Step 4',
        h4Green: 'Continue earning',
        h4Rest: ' from your referrals!',
        text:
            'You’ll continue earning referral commission on trading and sales activities from everyone you refer, as well as a % from everyone they refer!',
    },
];

const HIW: React.FC = () => {
    return (
        <section id="how-it-works">
            <h2 className="center">How It Works</h2>
            <h4 className="center">No purchase is necessary to take part in the referral program giveaway.</h4>
            <div className="steps">{steps.map(step)}</div>
        </section>
    );
};

export { HIW };
