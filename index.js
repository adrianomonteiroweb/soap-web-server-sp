const https = require("https");
const axios = require("axios");
const fs = require("fs");

const { buildEnvelope } = require("./utils");

const certificate_path = "./certificado/certificado.pem";
const private_key = "./certificado/private.pem";
const certificate = fs.readFileSync(certificate_path);
const privateKey = fs.readFileSync(private_key);

const envelope_file = "./xmls/envelope.xml";
const mensagem_file = "./xmls/mensagem.xml";

const envelope = buildEnvelope(
  certificate,
  privateKey,
  {
    CPFCNPJRemetente: "36114236882",
    CPFCNPJRemetente: "62391818000130",
    Inscricao: "123456789",
    dtInicio: "2020-01-01",
    dtFim: "2020-01-01",
  },
  fs.readFileSync(mensagem_file).toString(),
  fs.readFileSync(envelope_file).toString()
);

fs.writeFileSync("signed.xml", envelope);

console.log("envelope", typeof envelope);

const config = {
  method: "post",
  url: "https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx?WSDL",
  headers: {
    "Content-Type": "text/xml",
  },
  requestCert: true,
  data: envelope,
  httpsAgent: new https.Agent({
    cert: certificate,
    key: privateKey,
    rejectUnauthorized: false,
  }),
};

(async () => {
  const { data } = await axios(config);
  console.log(data);
})();
