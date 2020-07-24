export const saveParametersFromUrl = search => {
    const array = search.slice(1).split('&');
    // tslint:disable-next-line:no-console
    console.log('...........array', array);
    if (array.length > 0) {
        for (const item of array) {
            const keyValue = item.split('=');
            localStorage.setItem(keyValue[0], keyValue[1]);
        }
    }
};
