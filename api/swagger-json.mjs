import handler from '../index.mjs';

export default async (req, res) => {
  req.url = '/swagger.json';
  return handler(req, res);
};
