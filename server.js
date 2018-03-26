const request = require('request');
const parseString = require('xml2js').parseString;

module.exports = function (options) {
  const { AUTH_SERVER, emailPostfix } = options
  this.bindHook('third_login', (ctx) => {
    let ticket = ctx.request.body.ticket || ctx.request.query.ticket;
    let requestUrl = ctx.request.protocol + '://' + ctx.request.host + ctx.request.path;
    let validateUrl = AUTH_SERVER + '?service=' + encodeURIComponent(requestUrl) + '&ticket=' + ticket;
    return new Promise((resolve, reject) => {
      request.get(validateUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          parseString(body, function(error, result) {
            if (error) {
              reject(error);
            } else {
              result = result['cas:serviceResponse'];
              if(result['cas:authenticationFailure']) {
                reject(result['cas:authenticationFailure'][0]);
              } else {
                  result = result['cas:authenticationSuccess'][0];
                  let username = result['cas:user'][0]
                  resolve({
                    email: username + emailPostfix,
                    username: username
                  })
              }
            }
          })
        } else {
          reject(error);
        }
      })
    })
  });
}