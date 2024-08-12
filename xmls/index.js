const pedidoXMLConsultaNFePeriodo = ({
  CPF_CNPJ_Remetente,
  CPF_CNPJ,
  inscricao,
  dt_inicio, // no formato “AAAA-MM-DD”
  dt_fim,
  numero_pagina,
}) => `<?xml version="1.0" encoding="UTF-8"?>
<p1:PedidoConsultaNFePeriodo xmlns:p1="http://www.prefeitura.sp.gov.br/nfe" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Cabecalho Versao="1">
    <CPFCNPJRemetente>
      <CNPJ>${CPF_CNPJ_Remetente}</CNPJ>
    </CPFCNPJRemetente>
    <CPFCNPJ>
      <CNPJ>${CPF_CNPJ}</CNPJ>
    </CPFCNPJ>
    <Inscricao>${inscricao}</Inscricao>
    <dtInicio>${dt_inicio}</dtInicio>
    <dtFim>${dt_fim}</dtFim>
    <NumeroPagina>${numero_pagina}</NumeroPagina>
  </Cabecalho>
</p1:PedidoConsultaNFePeriodo>`;

module.exports = {
  pedidoXMLConsultaNFePeriodo,
};
