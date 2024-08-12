const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const { config } = require("dotenv");

config();

const app = express();

const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

try {
  const privateKeyPath = process.env.SSL_KEY || "./certificado/private.key";
  const publicKeyPath =
    process.env.SSL_CERT || "./certificado/certificado_sem_senha.pem";

  if (!privateKeyPath || !publicKeyPath) throw new Error();

  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const certificate = fs.readFileSync(publicKeyPath, "utf8");

  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(httpsPort, () => {
    isUsingHTTPS = true;
    console.log(`HTTPS Server listening on port ${httpsPort}`);
  });
} catch (ex) {
  console.error("Certificates not found. Not using HTTPS");
  console.error(ex);
}

const httpServer = http.createServer(app);

httpServer.listen(httpPort, () => {
  console.log(`HTTP Server listening on port ${httpPort}`);
});
