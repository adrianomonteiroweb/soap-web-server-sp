var SignedXml = require("xml-crypto").SignedXml,
  fs = require("fs");

const getSignedXml = (xml, certificate_path) => {
  const certificate = fs.readFileSync(certificate_path);
  const sig = new SignedXml({
    privateKey: certificate,
  });

  sig.keyInfoProvider = {
    getKeyInfo: function () {
      return `
        <X509Data>
          <X509Certificate>${certificate.toString("base64")}</X509Certificate>
        </X509Data>`;
    },
  };

  sig.addReference({
    xpath: "//*[local-name(.)='Cabecalho']",
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
    transforms: ["http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
  });
  sig.canonicalizationAlgorithm =
    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
  sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
  sig.computeSignature(xml);

  const signedXmlWithKeyInfo = sig
    .getSignedXml()
    .replace(
      "</Signature>",
      `<KeyInfo>${sig.keyInfoProvider.getKeyInfo()}</KeyInfo></Signature>`
    );

  fs.writeFileSync("signed.xml", signedXmlWithKeyInfo);

  return { data: signedXmlWithKeyInfo, certificate };
};

module.exports = {
  getSignedXml,
};
