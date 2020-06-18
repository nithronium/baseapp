export const getParameters = () => {
    const utmSource = localStorage.getItem('utm_source');
    const utmMedium = localStorage.getItem('utm_medium');
    const utmCampaign = localStorage.getItem('utm_campaign');
    const utmContent = localStorage.getItem('utm_content');
    const utmTerm = localStorage.getItem('utm_term');
    const refid = localStorage.getItem('refid');
    const data = {};
    // tslint:disable-next-line
    if (utmSource) { data['utm_source'] = utmSource }
    // tslint:disable-next-line
    if (utmMedium) { data['utm_medium'] = utmMedium }
    // tslint:disable-next-line
    if (utmCampaign) { data['utm_campaign'] = utmCampaign }
    // tslint:disable-next-line
    if (utmContent) { data['utm_content'] = utmContent }
    // tslint:disable-next-line
    if (utmTerm) { data['utm_term'] = utmTerm }
    // tslint:disable-next-line
    if (refid) { data['refid'] = refid }
    return Object.keys(data).length > 0 ? data : false;
};

export const removeParameters = () => {
    localStorage.removeItem('utm_source');
    localStorage.removeItem('utm_medium');
    localStorage.removeItem('utm_campaign');
    localStorage.removeItem('utm_content');
    localStorage.removeItem('utm_term');
    localStorage.removeItem('refid');
};
