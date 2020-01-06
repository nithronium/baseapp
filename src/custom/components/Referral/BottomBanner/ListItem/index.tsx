import * as React from 'react';
import { styles } from './styles';
//tslint:disable
import Media from 'react-media';

interface ListItemProps {
    children: React.ReactElement | React.ReactNodeArray | string;
    header: string;
    img: string;
}

const renderDesktop = ({ img, header, children }) => {
    return (
        <div style={styles.mainWrapper}>
            <img style={styles.img} src={img} />
            <div>
                <div style={styles.header}>{header}</div>
                <div style={styles.content}>
                    {children}
                </div>
            </div>
        </div>

    )
    
}

const renderMobile = ({ img, header, children }) => {
    return (
        <div style={styles.mainWrapperMobile}>
        <img style={styles.imgMobile} src={img} />
        <div>
            <div style={styles.headerMobile}>{header}</div>
            <div style={styles.contentMobile}>
                {children}
            </div>
        </div>
    </div>
    )
    
}

export const ListItem: React.FC<ListItemProps> = ({img, children, header}) => {
    return (
        <Media queries={{
            mobile: "(max-width: 499px)",
            desktop: "(min-width: 500px)"
        }}>
            {matches => (
            <React.Fragment>
                    {matches.desktop && renderDesktop({ img, children, header })}
                    {matches.mobile && renderMobile({ img, children, header })}
            </React.Fragment>   
        )}
        
        </Media>
    );
};
