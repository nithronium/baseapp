import { RootState } from '../../index';
import { DepthState, OrderBookState } from './types';

export const selectOrderBookLoading = (state: RootState): boolean =>
  state.public.orderBook.loading;


export const selectOrderBook = (state: RootState): OrderBookState =>
  state.public.orderBook;

export const selectDepthAsks =
  (state: RootState): DepthState['asks'] => state.public.depth.asks;

export const selectDepthBids =
  (state: RootState): DepthState['bids'] => state.public.depth.bids;

export const selectDepthLoading = (state: RootState): boolean =>
  state.public.depth.loading;
