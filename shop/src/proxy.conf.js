var PROXY_CONFIG = {
  "/api":{
    "target": "http://127.0.0.1:8000/",
    "secure": false
  },
  "/app/static":{
    "target": "http://127.0.0.1:8000/",
    "secure": false
  }
};

module.exports = PROXY_CONFIG;