export const getParameters = () => {
    const utmSource = localStorage.getItem('utmSource');
    const utmMedium = localStorage.getItem('utmMedium');
    const utmCampaign = localStorage.getItem('utmCampaign');
    const utmContent = localStorage.getItem('utmContent');
    const utmTerm = localStorage.getItem('utmTerm');
    const refid = localStorage.getItem('referralCode');
    const data = {};
    // tslint:disable-next-line
    if (utmSource) { data['utmSource'] = utmSource }
    // tslint:disable-next-line
    if (utmMedium) { data['utmMedium'] = utmMedium }
    // tslint:disable-next-line
    if (utmCampaign) { data['utmCampaign'] = utmCampaign }
    // tslint:disable-next-line
    if (utmContent) { data['utmContent'] = utmContent }
    // tslint:disable-next-line
    if (utmTerm) { data['utmTerm'] = utmTerm }
    // tslint:disable-next-line
    if (refid) { data['refid'] = refid }
    return Object.keys(data).length > 0 ? data : false;
};

export const removeParameters = () => {
    localStorage.removeItem('utmSource');
    localStorage.removeItem('utmMedium');
    localStorage.removeItem('utmCampaign');
    localStorage.removeItem('utmContent');
    localStorage.removeItem('utmTerm');
    localStorage.removeItem('referralCode');
};
