export const saveParametersFromUrl = search => {
    const array = search.slice(1).split('&');
    if (array.length > 0) {
        for (const item of array) {
            const keyValue = item.split('=');
            localStorage.setItem(keyValue[0], keyValue[1]);
        }
    }
};
