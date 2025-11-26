// Swagger UI serverless function
export default async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  // Get the current host for the API URL
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTAPP Backend API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
        .swagger-ui .topbar {
            background-color: #667eea;
        }
        .swagger-ui .topbar .download-url-wrapper .select-label {
            color: white;
        }
        .swagger-ui .topbar .download-url-wrapper input[type=text] {
            border: 2px solid #764ba2;
        }
        .swagger-ui .info .title {
            color: #667eea;
        }
        .swagger-ui .scheme-container {
            background: #f8f9fa;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
        }
        .swagger-ui .info {
            margin: 30px 0;
        }
        .swagger-ui .info .title small {
            background: #667eea;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            console.log('Loading Swagger UI...');
            console.log('API Base URL: ${baseUrl}');
            
            const ui = SwaggerUIBundle({
                url: '${baseUrl}/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                validatorUrl: null,
                tryItOutEnabled: true,
                filter: true,
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                requestInterceptor: function(request) {
                    console.log('Request:', request.method, request.url);
                    // Ensure CORS headers are properly handled
                    request.headers = request.headers || {};
                    
                    // Log for debugging
                    console.log('Request headers:', request.headers);
                    
                    return request;
                },
                responseInterceptor: function(response) {
                    console.log('Response:', response.status, response.url);
                    
                    // Log response for debugging
                    if (response.status >= 400) {
                        console.error('Error response:', response.status, response.statusText);
                        console.error('Response body:', response.body);
                    }
                    
                    return response;
                },
                onComplete: function() {
                    console.log('Swagger UI loaded successfully');
                }
            });
            
            window.ui = ui;
        };
    </script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).send(html);
};
