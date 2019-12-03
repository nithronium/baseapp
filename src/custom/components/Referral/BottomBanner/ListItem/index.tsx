import * as React from 'react';
import { styles } from './styles';
//tslint:disable
import Media from 'react-media';

interface ListItemProps {
    children: React.ReactElement | React.ReactNodeArray | string;
    header: string;
    children2?: React.ReactElement | React.ReactNodeArray | string;
    header2?: string;
    img: string;
}

const renderDesktop = ({ img, header, children, header2, children2 }) => {
    return (
        <div style={styles.mainWrapper}>
            <img style={styles.img} src={img} alt=""/>
            <div>
                <div style={styles.header}>{header}</div>
                <div style={styles.content}>
                    {children}
                </div>
                {header2 && <React.Fragment><div style={styles.header}>{header2}</div>
                <div style={styles.content}>
                    {children2}
                </div>
                </React.Fragment>}
            </div>
        </div>

    )
    
}

const renderMobile = ({ img, header, children, header2, children2 }) => {
    return (
        <div style={styles.mainWrapperMobile}>
        <img style={styles.imgMobile} src={img} alt=""/>
        <div>
            <div style={styles.headerMobile}>{header}</div>
            <div style={styles.contentMobile}>
                {children}
            </div>
            {header2 && <React.Fragment><div style={styles.headerMobile}>{header2}</div>
                <div style={styles.contentMobile}>
                    {children2}
                </div>
            </React.Fragment>}
        </div>
    </div>
    )
    
}

export const ListItem: React.FC<ListItemProps> = ({img, children, header, header2, children2}) => {
    return (
        <Media queries={{
            mobile: "(max-width: 499px)",
            desktop: "(min-width: 500px)"
        }}>
            {matches => (
            <React.Fragment>
                    {matches.desktop && renderDesktop({ img, children, header, children2, header2 })}
                    {matches.mobile && renderMobile({ img, children, header, children2, header2 })}
            </React.Fragment>   
        )}
        
        </Media>
    );
};
