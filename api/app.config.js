//let tokenExpiration = 6000 * 600 * 24; // expires in 24 hours (value expresed in miliseconds.)
const configs = {
  tokens: {
    // expiration: tokenExpiration,
    secretKey: "Tecnibilds2018!"
  },
  database: {
    name: "Tecnibilds",
    //NO CAMBIAR. SOLO USAR LOCALHOST
    //url: "mongodb://18.208.211.71:27017/"
    url: "mongodb://localhost:27017/"
  },
  rolbar: {
    post_server_item: ""
  },

};

module.exports = configs;
