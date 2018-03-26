import React, { Component } from 'react'

const qualifyURL = (url, encode) => {
  url = url || '';
  let ret = location.protocol + '//' + location.host + (url.substr(0, 1) === '/' ? '' : location.pathname.match(/.*\//)) + url;
  if (encode) {
    ret = encodeURIComponent(ret);
  }
  return ret;
}

module.exports = function (options) {

  const handleLogin = () => {
    const loginURI = '/api/user/login_by_token';
    const { LOGIN_SERVER } = options;
    let ret = qualifyURL(loginURI, true);
    let redirectURL = LOGIN_SERVER  + '?service=' + ret;
    location.href = redirectURL;
  }

  const WSComponent = () => (
    <button onClick={handleLogin} className="btn-home btn-home-normal" >PORTAL 登录</button>
  )
  this.bindHook('third_login', WSComponent);
}