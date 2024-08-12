const https = require("https");
const axios = require("axios");
const fs = require("fs");

const { getSignedXml } = require("./xml_crypto");
const { pedidoXMLConsultaNFePeriodo } = require("./xmls");

const XML_SEM_ASSINATURA = pedidoXMLConsultaNFePeriodo({
  CPF_CNPJ_Remetente: "36114236882",
  CPF_CNPJ: "62391818000130",
  inscricao: "123456",
  dt_inicio: "2024-07-01",
  dt_fim: "2024-07-31",
  numero_pagina: "1",
});

const certificate_path = "./certificado/certificado_sem_senha.pem";
const private_key = "./certificado/private.key";

const XML_ASSINADO = getSignedXml(XML_SEM_ASSINATURA, certificate_path);

const certificate = fs.readFileSync(certificate_path);
const privateKey = fs.readFileSync(certificate_path);
const passphrase = "1234";

const config = {
  method: "post",
  url: "https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx?WSDL",
  headers: {
    "Content-Type": "text/xml",
  },
  requestCert: true,
  data: XML_ASSINADO.data,
  httpsAgent: new https.Agent({
    // ca: XML_ASSINADO.certificate,
    cert: certificate,
    // passphrase: passphrase,
    rejectUnauthorized: false,
  }),
};

(async () => {
  const { data } = await axios(config);
  console.log(data);
})();
