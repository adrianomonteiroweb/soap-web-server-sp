const fs = require("fs");
const { SignedXml } = require("xml-crypto");
const xpath = require("xpath");
const dom = require("xmldom").DOMParser;
const select = xpath.useNamespaces({
  ds: "http://www.w3.org/2000/09/xmldsig#",
});

const caminhoCertificado = "./certificado/booo_teixeira_123456.pem";
const certificadoPem = fs.readFileSync(caminhoCertificado, "utf8");

// Seu XML de consulta
const xmlConsultaData = `<?xml version="1.0" encoding="UTF-8"?>
<p1:PedidoConsultaNFe xmlns:p1="http://www.prefeitura.sp.gov.br/nfe" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Cabecalho Versao="1">
    <CPFCNPJRemetente>
      <CNPJ>04642554000143</CNPJ>
    </CPFCNPJRemetente>
  </Cabecalho>
  <Detalhe>
    <ChaveNFe>
      <InscricaoPrestador>31000000</InscricaoPrestador>
      <NumeroNFe>51</NumeroNFe>
    </ChaveNFe>
  </Detalhe>
  <Detalhe>
    <ChaveRPS>
      <InscricaoPrestador>31000000</InscricaoPrestador>
      <SerieRPS>LLLLL</SerieRPS>
      <NumeroRPS>2</NumeroRPS>
    </ChaveRPS>
  </Detalhe>
</p1:PedidoConsultaNFe>`;

// Parse do XML
const doc = new dom().parseFromString(xmlConsultaData);

// Cria um novo objeto para assinar
const sig = new SignedXml();

// Adiciona a chave e o certificado
sig.signingKey = certificadoPem;
sig.keyInfoProvider = {
  getKeyInfo: function () {
    return (
      "<X509Data><X509Certificate>" +
      certificadoPem +
      "</X509Certificate></X509Data>"
    );
  },
};

// Assina o XML
sig.addReference("//*[local-name(.)='PedidoConsultaNFe']");
sig.computeSignature(doc.toString());

// Converte de volta para string
const signedXml = sig.getSignedXml();

// Agora você pode usar o signedXml na requisição SOAP
console.log(signedXml);

const axios = require("axios");

const config = {
  method: "post",
  url: "https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx?WSDL",
  headers: {
    "Content-Type": "text/xml",
  },
  data: signedXml,
  httpsAgent: new https.Agent({
    pfx: fs.readFileSync(caminho_certificado),
    passphrase: senha,
    rejectUnauthorized: false, // Ajuste conforme necessário
  }),
};

(async () => {
  const { data } = await axios(config);
  console.log(data);
})();
