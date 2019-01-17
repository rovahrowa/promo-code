module.exports = (req, res, next) => {
    const allowHeaders = ['Origin', 'Accept', 'Accept-Version', 'Content-Length',
      'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'X-Response-Time',
      'X-PINGOTHER', 'X-CSRF-Token', 'X-Session-Object', 'Authorization','ztoken'
    ];
  
    const allowMethods = ['get', 'post', 'options'];
    const allowedOrigins = ['*']; // , 'http://dash.mobitill.com'];
  
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.setHeader('Access-Control-Allow-Methods', allowMethods.join(', '));
  
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(','));
    if (req.method.toLowerCase() === 'options') {
      res.end();
      return;
    }
    next();
  }