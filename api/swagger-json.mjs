// Swagger JSON serverless function - serves swagger.json from Hapi server
import handler from '../index.mjs';

export default async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  // Proxy to the Hapi server's swagger.json endpoint
  req.url = '/swagger.json';
  return handler(req, res);
};
