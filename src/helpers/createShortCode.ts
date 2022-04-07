import _ from 'lodash';

const createShortCode = (length: number = 6): string => {
  const characters: string[] = [
    // digits
    ..._.times(10, (n) => n.toString()),
    // uppercase
    ..._.times(26, (n) => {
      return String.fromCharCode(n + 65);
    }),
    // lowercase
    ..._.times(26, (n) => {
      return String.fromCharCode(n + 97);
    }),
  ];
  return _.sampleSize(characters, length).join('');
};

export default createShortCode;
