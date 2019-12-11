import * as helpers from './';

describe('Custom helpers', () => {
    // checkDate.ts
    it('should check isValidDate', () => {
        const currentDate = new Date();
        let dateToCompare = currentDate.setFullYear(currentDate.getFullYear() - 100);
        expect(helpers.isValidDate('22/12/2000', dateToCompare)).toEqual(true);
        dateToCompare = currentDate.setFullYear(currentDate.getFullYear() - 100);
        expect(helpers.isValidDate('22/12/1000', dateToCompare)).toEqual(false);
    });
});
