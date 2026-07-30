# 🍰 API - Sistema de Venda de Bolos

API desenvolvida em Python com Flask para gerenciamento de uma loja de bolos sob encomenda.

## 📖 Sobre o projeto

O objetivo deste projeto é simular o funcionamento de uma confeitaria online.

O cliente poderá:

- Visualizar os bolos disponíveis.
- Escolher sabor e tamanho.
- Adicionar produtos ao carrinho.
- Calcular o valor do pedido.
- Finalizar a compra.
- Realizar o pagamento.
- Após a confirmação do pagamento, o dono da confeitaria receberá uma notificação com os dados do pedido.

---

## 🚀 Tecnologias utilizadas

- Python
- Flask
- Flask-CORS

---

## 📂 Rotas implementadas

### API

- `GET /`
  - Verifica se a API está funcionando.

### Bolos

- `GET /bolos/`
  - Lista todos os bolos.

- `GET /bolos/<id>`
  - Busca um bolo específico pelo ID.

### Carrinho

- `POST /carrinho/`
  - Adiciona um item ao carrinho.

### Cálculo

- `POST /calcular/`
  - Calcula o valor do pedido com base no bolo, sabor e tamanho escolhidos.

### Pedidos

- `POST /pedidos/`
  - Cria um novo pedido.

- `DELETE /pedidos/<id>`
  - Cancela um pedido.

---

## 📌 Funcionalidades em desenvolvimento

- Listar itens do carrinho.
- Remover itens do carrinho.
- Atualizar quantidade de itens.
- Cálculo automático do valor total.
- Integração com banco de dados.
- Integração com Mercado Pago.
- Atualização automática do status do pagamento.
- Envio de notificação para o dono da confeitaria.
- Organização do projeto em módulos (routes, services e models).
- Validação dos dados recebidos pela API.

---

## ▶️ Como executar

Clone o projeto:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd novo_api
```

Instale as dependências:

```bash
pip install flask flask-cors
```

Execute:

```bash
python app.py
```

A API ficará disponível em:

```
http://127.0.0.1:5000
```

---

## 🎯 Objetivo

Este projeto está sendo desenvolvido para praticar conceitos de desenvolvimento de APIs REST com Python, incluindo rotas, manipulação de dados, integração com meios de pagamento e organização de projetos backend.
