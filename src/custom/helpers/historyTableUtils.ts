export const orderHistoryMapping = {
    wait: 'var(--color-green)',
    done: 'var(--yellow)',
    cancel: 'var(--color-red)',
};

export const setOrderType = (type: string) => orderHistoryMapping[type] || { color: '', text: '' };
