import * as React from 'react';
import { injectIntl } from 'react-intl';

const Timelines = injectIntl(({intl}) => {
  return (
    <section id="timelines">
      <h2 className="center">{intl.formatMessage({ id: 'timeline.title' })}</h2>
      <div className="timeline">
        <div className="begin">
          {intl.formatMessage({ id: 'timeline.start.text' })}<br/>
          <b>{intl.formatMessage({ id: 'timeline.start.date' })}<br/>
          {intl.formatMessage({ id: 'timeline.start.time' })}
          </b>
        </div>
        <div className="round1">
          {intl.formatMessage({ id: 'timeline.round1.text' })}<br/>
          <b>{intl.formatMessage({ id: 'timeline.round1.date' })}<br/>
          {intl.formatMessage({ id: 'timeline.round1.time' })}
          </b>
        </div>
        <div className="round2">
          {intl.formatMessage({ id: 'timeline.round2.text' })}<br/>
          <b>{intl.formatMessage({ id: 'timeline.round2.date' })}<br/>
          {intl.formatMessage({ id: 'timeline.round2.time' })}
          </b>
        </div>
        <div className="end">
            {intl.formatMessage({ id: 'timeline.end.text' })}
        </div>
      </div>
    </section>
  );
});

export {Timelines};
