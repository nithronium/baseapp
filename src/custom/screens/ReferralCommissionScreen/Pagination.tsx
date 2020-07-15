import * as React from 'react';

const PrevIcon = () => {
    return (
        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0545 7.4L12.7782 6L7.30853 12L12.7782 18L14.0545 16.6L9.86105 12L14.0545 7.4Z" fill="var(--pagination-active)" fill-opacity=""/></svg>
    );
};

const NextIcon = () => {
    return (
        <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.61279 7.4L9.88905 6L15.3587 12L9.88905 18L8.61279 16.6L12.8062 12L8.61279 7.4Z" fill="var(--pagination-active)" fill-opacity=""/></svg>
    );
};

interface Props {
    firstElemIndex: number;
    lastElemIndex: number;
    total: number;
    page: number;
    onClickPrevPage: () => void;
    onClickNextPage: () => void;
    nextPageExists: boolean;
    caption?: string;
}

export class Pagination extends React.Component<Props> {
    public render() {
        const { firstElemIndex, lastElemIndex, total, caption } = this.props;

        return (
            <div className="pg-history-elem__pagination">
                <p>{caption}{' '}{firstElemIndex} - {lastElemIndex} of {total}</p>
                <button
                    className="pg-history__pagination-prev"
                    onClick={this.onClickPrev}
                    style={{ opacity: firstElemIndex === 1 ? 0.5 : 1 }}
                >
                    <PrevIcon />
                </button>
                <button
                    className="pg-history__pagination-prev"
                    onClick={this.onClickNext}
                    style={{ opacity: lastElemIndex === total ? 0.5 : 1 }}
                >
                    <NextIcon />
                </button>
            </div>
        );
    }

    private onClickPrev = () => {
        this.props.onClickPrevPage();
    };

    private onClickNext = () => {
        this.props.onClickNextPage();
    };
}
