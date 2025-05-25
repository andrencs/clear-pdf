const fs = require("fs");
const pdfParse = require("pdf-parse");
const { acoes } = require("./contants/acoes");

const readPdf = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  return data.text;
};

const extrairQuantidadeEPreco = function (str, total) {
  let possibilidades = [];

  for (let i = str.length - 4; i >= 1; i--) {
    let preco = parseFloat(str.substring(i).replace(",", "."));
    let teste = str.substring(0, i);

    qtd = total / preco;

    if (
      Math.abs(qtd - Math.round(qtd)) < 0.001 &&
      teste.includes(Math.round(qtd))
    ) {
      possibilidades.push({ preco, qtd: Math.round(qtd) });
    }
  }

  if (possibilidades.length == 0) {
    throw new Error(
      "Não foi possível extrair quantidade e preço corretamente."
    );
  }

  possibilidades.sort((a, b) => a.qtd - b.qtd);

  return possibilidades[0];
};

const parseLinhaMovimentacao = (linha) => {
  const _MOV = {
    tipo: "",
    operacao: "",
    papel: "",
    qtd: -1,
    preco: -1,
    total: -1,
    liquidacao: "",
    "*": "",
  };

  if (!linha.startsWith("B3 RV LISTADO")) return null;

  linha = linha.replace("B3 RV LISTADO", "").trim();
  linha = linha.replace("#", "").trim();

  linha = linha.replace(/\s+/g, " ");

  const tipoLetra = linha[0];
  _MOV.tipo = tipoLetra === "C" ? "COMPRA" : "VENDA";

  _MOV.operacao = "VISTA";

  _MOV.liquidacao = linha.slice(-1) === "D" ? "DÉBITO" : "CRÉDITO";

  const miolo = linha.slice(6, -1);

  const regex =
    /^(?<papel>.+?\b(?:ON|N1|NM|N2))(?<qtd>\d+)(?<preco>\d+,\d{2})(?<total>\d+,\d{2})$/;

  const match = miolo.match(regex);

  if (match && match.groups) {
    const papel = match.groups.papel.trim();
    const qtd = Number(match.groups.qtd);
    const preco = parseFloat(match.groups.preco.replace(",", "."));
    const total = parseFloat(match.groups.total.replace(",", "."));

    _MOV.papel = acoes.get(papel) ?? papel;
    _MOV.total = total;

    console.log(
      `papel (${papel}), qtd (${qtd}), preco (${preco}), total (${total}), calc(${
        qtd * preco
      }), (${Math.abs(qtd * preco - total) < 0.01})`
    );

    if (Math.abs(qtd * preco - total) < 0.01) {
      _MOV.qtd = qtd;
      _MOV.preco = preco;
    } else {
      _MOV["*"] = "*";

      const qtd_preco = miolo.slice(
        match.groups.papel.trim().length,
        -match.groups.total.length
      );

      const { qtd: _qtd, preco: _preco } = extrairQuantidadeEPreco(
        qtd_preco,
        total
      );

      _MOV.qtd = _qtd;
      _MOV.preco = _preco;
    }

    return _MOV;
  }
};

const parseNotaClear = (text) => {
  const lines = text.split("\n").map((l) => l.trim());

  const movimentos = [];

  for (const line of lines) {
    const res = parseLinhaMovimentacao(line);

    if (res) {
      movimentos.push(res);
    }
  }

  return movimentos;
};

(async () => {
  const text = await readPdf(
    "./pdfs/NotaNegociacao_185800_20250506_110977122.pdf"
  );
  const dados = parseNotaClear(text);
  console.table(dados);

  console.log(
    `Os dados estão ${
      dados.some((item) => Math.abs(item.qtd * item.preco - item.total) > 0.01)
        ? "errados"
        : "certos"
    }`
  );
})();
