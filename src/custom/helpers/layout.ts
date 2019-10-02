// 1  -  Order
// 2  -  TradingChart
// 3  -  Orderbook
// 4  -  OpenOrders

export const customLayouts = {
    lg: [
        { x: 16, y: 18, w: 8, h: 23, i: '1', minH: 21, maxH: 21, minW: 4 },
        { x: 0, y: 0, w: 16, h: 39, i: '2', minH: 12, minW: 5 },
        { x: 16, y: 0, w: 8, h: 30, i: '3', minH: 12, minW: 8, resizable: false },
        { x: 0, y: 40, w: 16, h: 14, i: '4', minH: 12, minW: 5 },
    ],
    md: [
        { x: 14, y: 30, w: 10, h: 25, i: '1', minH: 21, maxH: 21, minW: 4 },
        { x: 0, y: 0, w: 18, h: 30, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 30, w: 14, h: 13, i: '3', minH: 8, minW: 3, resizable: false },
        { x: 0, y: 42, w: 14, h: 20, i: '4', minH: 6, minW: 5 },
    ],
    sm: [
        { x: 0, y: 12, w: 12, h: 22, i: '1', minH: 22, maxH: 22, minW: 5, draggable: false, resizable: false },
        { x: 0, y: 28, w: 12, h: 30, i: '2', minH: 30, minW: 5, draggable: false, resizable: false },
        { x: 0, y: 58, w: 12, h: 18, i: '3', minH: 12, minW: 12, draggable: false, resizable: false },
        { x: 0, y: 82, w: 12, h: 20, i: '4', minH: 12, minW: 7, draggable: false, resizable: false },
    ],
};
