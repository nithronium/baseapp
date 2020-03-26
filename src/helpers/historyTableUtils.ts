export const depositColorMapping = {
    accepted: 'var(--system-green)',
    collected: 'var(--system-green)',
    submitted: '',
    canceled: 'var(--system-red)',
    rejected: 'var(--system-red)',
};

export const withdrawColorMapping = {
    prepared: '',
    submitted: '',
    canceled: 'var(--system-red)',
    accepted: 'var(--system-green)',
    suspected: '',
    rejected: 'var(--system-red)',
    processing: '',
    succeed: 'var(--system-green)',
    failed: 'var(--system-red)',
    errored: 'var(--system-red)',
    confirming: '',
};

export const ieoColorMapping = {
    completed: 'var(--color-green)',
    cancelled: 'var(--color-red)',
    purchased: 'var(--color-green)',
    closed: 'var(--color-red)',
};

export const tradesColorMapping = {
    sell: {
        color: 'var(--asks)',
        text: 'Sell',
    },
    buy: {
        color: 'var(--bids)',
        text: 'Buy',
    },
};

export const setDepositStatusColor = (status: string): string => depositColorMapping[status];

export const setWithdrawStatusColor = (status: string): string => withdrawColorMapping[status];

export const setIEOStatusColor = (status: string): string => ieoColorMapping[status];

export const setTradesType = (type: string) => tradesColorMapping[type] || { color: '', text: '' };
