import handler from '../index.mjs';

export default async (req, res) => {
  req.url = '/documentation';
  return handler(req, res);
};
