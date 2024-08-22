const mustache = require("mustache");
const SignedXml = require("xml-crypto").SignedXml;

function buildEnvelope(cert, key, data, messageTemplate, envelopeTemplate) {
  const message = mustache.render(messageTemplate, {
    ...data,
    DigestValue: _cleanKey(cert),
    SignatureValue: "{{SignatureValue}}",
    X509Certificate: String(cert),
  });

  const envelope = mustache.render(envelopeTemplate, {
    message,
  });
  const signature = signXML(cert, key, envelope);

  const xml_signed = mustache.render(envelope, {
    SignatureValue: signature,
  });

  return xml_signed;
}

function signXML(cert, key, xml) {
  const cleanedKey = _cleanKey(cert);
  const signer = new SignedXml();

  function KeyInfo() {
    this.getKeyInfo = function () {
      return (
        "<X509Data><X509Certificate>" +
        cleanedKey +
        "</X509Certificate></X509Data>"
      );
    };
    this.getKey = function () {
      return key;
    };
  }

  signer.keyInfoProvider = new KeyInfo();
  signer.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
  signer.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";
  signer.addReference("/*", [
    "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  ]);
  signer.references[0].isEmptyUri = true;
  signer.signingKey = key;
  signer.computeSignature(xml);

  return signer.getSignatureXml();
}

function _cleanKey(key) {
  key = String(key);

  // Remove break lines.
  key = key.replace(/[\r|\n]/g, "");

  // Get just hash.
  key = key.split("-----")[2];

  return key;
}

module.exports = {
  buildEnvelope,
};
