# 📊 Clear PDF - Extração de Notas de Corretagem

Projeto de extensão da Universidade Descomplica com foco em automação de extração e organização de informações financeiras a partir de notas de corretagem em formato PDF.

## 🧠 Objetivo

Desenvolver uma ferramenta automatizada capaz de interpretar documentos financeiros não estruturados e convertê-los em dados organizados, facilitando o controle e a análise de investimentos no mercado financeiro.

## 🚀 Funcionalidades

- 📥 Leitura de arquivos PDF com notas de corretagem
- 🧾 Extração automática de dados como:
  - Nome do ativo (papel)
  - Tipo e operação
  - Quantidade comprada/vendida
  - Preço unitário e total
  - Tipo de liquidação
- 🔍 Processamento inteligente com expressões regulares
- 🧹 Limpeza e estruturação dos dados para análise

## 🛠️ Tecnologias utilizadas

- Node.js
- pdf-parse
- Expressões Regulares (Regex)
- JavaScript moderno (ES6+)

## 🏗️ Estrutura

```
📁 src/
┣ 📁 constants/
┃ ┗ 📄 acoes.js → Arquivo com mapeamento do nome da ação para o código
┗ 📄 index.js → Função principal de processamento
```

## 🧪 Como usar

1. Instale as dependências:

```bash
npm install
```

2. Coloque o PDF na pasta (ex: /notas)

3. Altere o caminho do pdf dentro do arquivo index.js

4. Execute o script principal:

```bash
node src/index.js
```

5. Os dados extraídos aparecerão no console.

## 📚 Conclusão

O projeto mostrou-se eficaz na conversão de dados financeiros não estruturados em informações úteis e acessíveis, facilitando o acompanhamento de investimentos de forma prática e precisa.
