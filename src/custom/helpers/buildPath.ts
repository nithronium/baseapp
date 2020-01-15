export const buildPath = (path: string, lang: string) => {
  // tslint:disable
  let _path = path;
  if (path.includes('http')) { _path = ''; }
  const url = lang.toLowerCase() === 'en' ? _path : `/${lang.toLowerCase()}${_path}`;
  // tslint:disable-next-line: no-console
  // console.log(url);
  return url;
};
