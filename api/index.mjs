// Vercel serverless function entry point
// Import the server instance and init function from root
import { server, init } from '../index.mjs';

// Global server instance for this serverless function
let serverInstance = null;
let initializationPromise = null;

// Export the serverless handler
export default async (req, res) => {
  try {
    // Set CORS headers immediately for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    
    // Initialize server if not already done (with singleton pattern)
    if (!serverInstance) {
      if (!initializationPromise) {
        console.log('Initializing Hapi server for Vercel...');
        initializationPromise = init().then(() => {
          serverInstance = server;
          console.log('Hapi server initialized successfully');
          return serverInstance;
        }).catch(error => {
          console.error('Failed to initialize server:', error);
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
          initializationPromise = null; // Reset to allow retry
          throw error;
        });
      }
      await initializationPromise;
    }
    
    if (!serverInstance) {
      throw new Error('Server instance is null after initialization');
    }
    
    // Parse body if needed
    let body = req.body;
    console.log(`[${req.method}] ${req.url}`);
    console.log('Raw body type:', typeof body);
    
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
        console.log('Parsed body from string');
      } catch (e) {
        console.log('Body is not JSON string:', e.message);
      }
    }
    
    if (body && typeof body === 'object') {
      console.log('Request body keys:', Object.keys(body));
    }
    
    // Handle the request using Hapi's server (Promise-based inject)
    console.log(`Processing request: ${req.method} ${req.url}`);
    
    const hapiResponse = await serverInstance.inject({
      method: req.method,
      url: req.url,
      headers: req.headers,
      payload: body
    });
    
    console.log(`Inject completed: ${req.method} ${req.url} - ${hapiResponse.statusCode}`);
    
    // Log error responses with full details
    if (hapiResponse.statusCode >= 400) {
      console.error('Error response:', hapiResponse.statusCode);
      console.error('Result:', JSON.stringify(hapiResponse.result));
    }
    
    // Set status code
    res.status(hapiResponse.statusCode);
    
    // Set headers from Hapi response
    Object.keys(hapiResponse.headers).forEach(key => {
      if (!key.toLowerCase().startsWith('access-control-')) {
        res.setHeader(key, hapiResponse.headers[key]);
      }
    });
    
    // Ensure CORS headers are still present
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log('About to send response...');
    
    // Send response and explicitly end
    if (typeof hapiResponse.result === 'object') {
      res.json(hapiResponse.result);
    } else {
      res.send(hapiResponse.result);
    }
    
    // Explicitly end the response to ensure clean function termination
    res.end();
    
    console.log('Response sent and ended, function should terminate');
  } catch (error) {
    console.error('Vercel function error:', error);
    console.error('Error stack:', error.stack);
    
    // Ensure CORS headers are set even on error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(500).json({ 
      code: '500',
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Explicitly end the response
    res.end();
  }
};

