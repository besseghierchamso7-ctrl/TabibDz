const https = require('https');

const data = JSON.stringify({
  email: 'test@example.com',
  password: 'Password1!1',
  firstName: 'Test',
  lastName: 'User'
});

const options = {
  hostname: 'tabibdz.onrender.com',
  port: 443,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
