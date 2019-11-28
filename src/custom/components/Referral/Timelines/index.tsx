import * as React from 'react';

const Timelines = props => {
  return (
    <section id="timelines">
      <h2 className="center">{props.title}</h2>
      <div className="timeline">
        <div className="begin">
          {props.text1}<br/>
          <b>{props.date1}<br/>
          {props.time1}
          </b>
        </div>
        <div className="end">
        {props.text2}<br/>
          <b>{props.date2}<br/>
          {props.time2}
          </b>
        </div>
      </div>
    </section>
  );
};

export {Timelines};
