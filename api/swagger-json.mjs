// Swagger JSON serverless function
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  try {
    // Read the swagger.json file
    const swaggerPath = join(__dirname, '..', 'swagger', 'swagger.json');
    const swaggerContent = readFileSync(swaggerPath, 'utf-8');
    const swaggerSpec = JSON.parse(swaggerContent);
    
    // Update server URL dynamically based on the request
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    
    const spec = { ...swaggerSpec };
    delete spec.host;
    delete spec.basePath;
    delete spec.schemes;
    spec.servers = [
      {
        url: baseUrl,
        description: process.env.VERCEL ? 'Vercel Production' : 'API Server'
      }
    ];
    
    // Add local development server if not in production
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      spec.servers.push({
        url: 'http://localhost:3000',
        description: 'Local Development'
      });
    }
    
    console.log('Serving Swagger spec with server URL:', baseUrl);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json(spec);
  } catch (error) {
    console.error('Error loading swagger spec:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      error: 'Failed to load API documentation',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
