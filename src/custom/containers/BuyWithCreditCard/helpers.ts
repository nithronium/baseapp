export const convert = (value: number, target: string, orderBook): number => {
    const { asks } = orderBook;
    const depth = asks.map(({ price, remaining_volume }) => [price, remaining_volume]);

    const getCumulativeTotal = proposals => {
        if (!proposals.length || (proposals[0].length < 2)) {
            throw Error('Invalid market depth');
        }

        let sum = 100;
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

        if (sum !== 0) {throw new Error('Not enough liquidity');}

        return total;
    };

    const res = getCumulativeTotal(depth);
    const weightedAverage = 100 / res;

    return target === 'fiat' ?
        value * weightedAverage :
        value / weightedAverage;
};
