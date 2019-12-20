import { CSSProperties } from 'react';

const mainWrapper: CSSProperties = {
    height: '683px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFD542',
};
const backgroundImg: CSSProperties = {
    position: 'absolute',
};

const content: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
};

const btn: CSSProperties = {
    background: 'black',
    color: 'white',
    margin: '50px',
};

const currency: CSSProperties = {
    fontWeight: 'normal',
    fontSize: '18px',
};

const list: CSSProperties = {
    width: '998px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
};

const headerWrapper = {
    marginBottom: '38px',
    marginTop: '60px',
};

const headerMainText = {
    marginBottom: '10px',
};

export const styles = {
    mainWrapper,
    btn,
    content,
    backgroundImg,
    currency,
    list,
    headerWrapper,
    headerMainText,
};
