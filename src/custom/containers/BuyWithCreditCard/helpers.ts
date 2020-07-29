export const convert = (value: number, target: string, orderBook): number => {
    const getCumulativeTotal = (amount, proposals) => {
        if (!proposals.length || (proposals[0].length < 2)) {
           // tslint:disable-next-line:no-console
           console.log('Invalid market depth');
        }

        let sum = amount;
        let total = 0;

        for (const proposal of proposals) {
            if (!sum) {
                break;
            }

            if (sum <= (+proposal[0] * +proposal[1])) {
                total += sum / (+proposal[0]);
                sum = 0;
            } else {
                total += +proposal[1];
                sum -= (+proposal[0] * +proposal[1]);
            }
        }

        if (sum !== 0) {
           // tslint:disable-next-line:no-console
           console.log('Not enough liquidity');
        }

        return total;
    };

    const depth = orderBook.asks.map(({ price, remaining_volume }) => [price, remaining_volume]);
    // tslint:disable-next-line
    const depthSum = depth.reduce((acc, [price, amount]) => acc += parseFloat(price) * parseFloat(amount), 0);
    const defaultSum = depthSum >= 100 ? 100 : depthSum;
    const totalRes = getCumulativeTotal(defaultSum, depth);
    const weightedAverage = defaultSum / totalRes;

    return target === 'fiat' ?
        value * weightedAverage :
        value / weightedAverage;
};
