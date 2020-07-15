import { getTotalPrice } from '../../../helpers';

export const convert = (value: number, target: string, orderBook): number => {
    const { asks } = orderBook;
    const depth = asks.map(({ price, remaining_volume }) => [price, remaining_volume]);

    // const totalPrice = asks.reduce((sum: number, { price, remaining_volume }) => {
    //     return sum + price * remaining_volume;
    // }, 0);
    // const totalVolume = asks.reduce((sum: number, { remaining_volume }) => {
    //     return Number(sum) + Number(remaining_volume);
    // }, 0);

    const totalPrice2 = getTotalPrice(value.toString(), depth);
    const totalVolume2 = value;
    // const weightedAverage = totalPrice / totalVolume;
    const weightedAverage2 = totalPrice2 / totalVolume2;

    return target === 'fiat' ?
        value * weightedAverage2 :
        value / weightedAverage2;
};
