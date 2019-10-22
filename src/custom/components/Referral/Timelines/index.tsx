import * as React from 'react';

const Timelines: React.FC = () => {
  return (
    <section id="timelines">
      <h2 className="center">Timelines</h2>
      <div className="timeline">
        <div className="begin">
          The giveaway starts on<br/>
          <b>October 21, 2019,<br/>
          09:00 GMT+3
          </b>
        </div>
        <div className="end">
          The giveaway ends on<br/>
          <b>December 24, 2019,<br/>
          18:00 GMT+3
          </b>
        </div>
      </div>
    </section>
  );
};

export {Timelines};
