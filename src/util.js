import debug from 'debug';
debug.enable('scripto:*');

export const logger = {
  metarpheus: debug('scripto:metarpheus'),
  metarpheusDiff: debug('scripto:metarpheus-diff')
};
