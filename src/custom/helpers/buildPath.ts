import { buildUrlWithRedirect } from './';

export const buildPath = (path: string, lang: string) => {
  // tslint:disable
  let _path = path;
  if (path.includes('http')) { _path = ''; }
  const url = lang.toLowerCase() === 'en' ? _path : `/${lang.toLowerCase()}${_path}`;
  // tslint:disable-next-line: no-console
  // console.log(url);
  return url;
};


export const handleRedirectToConfirm = (editParam: string, history) => {
  const lang = localStorage.getItem('lang_code') || 'en';
  switch (editParam) {
    case 'profile':
      history.push(buildPath(buildUrlWithRedirect('/confirm'), lang), { profileEdit: true });
      break;
    case 'address':
      history.push(buildPath(buildUrlWithRedirect('/confirm'), lang), { addressEdit: true });
      break;
    case 'profilePartialStep':
      history.push(buildPath(buildUrlWithRedirect('/confirm'), lang), { profilePartialStep: true });
      break;
    case 'phoneStep':
      history.push(buildPath(buildUrlWithRedirect('/confirm'), lang), { phoneStep: true });
      break;
    case 'identifyStep':
      history.push(buildPath(buildUrlWithRedirect('/confirm'), lang), { identifyStep: true });
      break;
    case 'addressStep':
      history.push(buildPath(buildUrlWithRedirect('/confirm'), lang), { addressStep: true });
      break;
    case 'profAddressStep':
      history.push(buildPath(buildUrlWithRedirect('/confirm'), lang), { profAddressStep: true });
      break;
    case 'questionnaireStep':
      history.push(buildPath('/confirm', lang), { questionnaireStep: true });
      break;
    default:
      break;
  }
};
