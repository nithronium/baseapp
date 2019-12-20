import { CSSProperties } from 'react';

const mainWrapper: CSSProperties = {
    height: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
};

const backGroundImg: CSSProperties = {
    position: 'absolute',
};

const textWrapper: CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
};

const highlightedText: CSSProperties = {
    color: '#00732F',
};

const btn: CSSProperties = {
    background: '#FFD641',
    padding: '9px 22px',
    fontSize: '11px',
    lineHeight: '14px',
    letterSpacing: '0.6px',
    marginLeft: '15px',
};

export const styles = {
    mainWrapper,
    textWrapper,
    backGroundImg,
    highlightedText,
    btn,
};
