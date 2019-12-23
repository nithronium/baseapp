import * as React from 'react';
import { styles } from './styles';

interface ListItemProps {
    children: React.ReactElement | React.ReactNodeArray | string;
    header: string;
    img: string;
}

export const ListItem: React.FC<ListItemProps> = ({img, children, header}) => {
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
    );
};
