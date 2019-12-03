export const buildPath = (path: string, lang: string) => {
  const url = lang.toLowerCase() === 'en' ? path : `/${lang.toLowerCase()}${path}`;
  // tslint:disable-next-line: no-console
  // console.log(url);
  return url;
};
