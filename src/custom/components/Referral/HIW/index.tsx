import * as React from 'react';

interface Step {
    h3: string;
    h4Green: string;
    h4Rest: string;
    text: string;
    soon?: string;
}
//tslint:disable
const step = (data: Step) => {
    return (
        <div key={data.h3} className="step">
            <h3 style={{ display: 'inline-block' }}>
                <span>{data.h3}</span>
            </h3>{' '}
            {data.soon && (
                <span style={{ fontSize: '16px', color: '#c3a026', paddingLeft: '10px' }}>
                    <b>({data.soon})</b>
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


const HIW = (props) => {
    return (
        <section id="how-it-works">
            <h2 className="center">{props.hiw}</h2>
            <h4 className="center">{props.subtitle}.</h4>
            <div className="steps">{props.steps.map(step)}</div>
        </section>
    );
};

export { HIW };
