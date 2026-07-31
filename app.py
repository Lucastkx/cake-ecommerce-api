from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


bolos = [
    {
        "id": 1,
        "nome": "Bolo de Ninho com Nutella",
        "descricao": "Massa fofinha, recheio de leite ninho e nutella.",

        "sabores": [
            {
                "id": 1,
                "nome": "Tradicional",
                "preco_adicional": 0
            },
            {
                "id": 2,
                "nome": "Com morango",
                "preco_adicional": 8
            }
        ],

        "tamanhos": [
            {
                "id": 1,
                "nome": "Pequeno (10 fatias)",
                "preco_base": 80
            },
            {
                "id": 2,
                "nome": "Médio (20 fatias)",
                "preco_base": 140
            }
        ]
    },


    {
        "id": 2,
        "nome": "Red Velvet",
        "descricao": "Massa aveludada com cream cheese.",

        "sabores": [
            {
                "id": 3,
                "nome": "Tradicional",
                "preco_adicional": 0
            }
        ],

        "tamanhos": [
            {
                "id": 3,
                "nome": "Pequeno (10 fatias)",
                "preco_base": 90
            },
            {
                "id": 4,
                "nome": "Médio (20 fatias)",
                "preco_base": 150
            }
        ]
    },
    
]

pedidos = []

carrinho = []

@app.route('/carrinho/', methods=['POST'])
def adicionar_carrinho():
    dados = request.json
    item = {
        "id": len(carrinho) + 1,
        "bolo_id": dados["bolo_id"],
        "sabor_id": dados["sabor_id"],
        "tamanho_id": dados["tamanho_id"],
        "quantidade": dados["quantidade"]
    }
    carrinho.append(item)
    return jsonify({
        'mensagem': "Item adicionado ao carrinho",
        'item': item
    })

# verificar os itens do carrinho
@app.route('/carrinho/', methods=['GET'])
def verificar_pedido():
    return jsonify(carrinho)



#remover itens do carrinho
def remover_item_carrinho(id):
    for indice, item in enumerate(carrinho):
        if item.get('id') == id:
            del carrinho[indice]
            return jsonify({
                "mensagem": "Item removido do carrinho"
            })
    return jsonify({
        "erro": "Item não encontrado no carrinho"
    }), 404


#verifica se esta funcionando
@app.route("/")
def inicio ():
    return jsonify({
        "mensagem": "Api funcionando"
    })


# me mostra meus bolos
@app.route("/bolos/")
def listar_bolos():
    return jsonify(bolos)


#fazer meu pedido
@app.route("/pedidos/", methods=["POST"])
def criar_pedido():
    dados = request.json
    pedido = {
        "id": len(pedidos) + 1,
        "cliente_nome": dados["cliente_nome"],
        "cliente_telefone": dados["cliente_telefone"],
        "bolo_id": dados["bolo_id"],
        "sabor_id": dados["sabor_id"],
        "tamanho_id": dados["tamanho_id"],
        "observacoes": dados["observacoes"],
        "data_entrega": dados["data_entrega"]
    }
    pedidos.append(pedido)
    return jsonify({
            "mensagem": "Pedido recebido com sucesso",
            "pedido": pedido,
             "checkout_url": "https://pagamento-teste.com"
    })


#me mostra o bolo que pedi por id
@app.route("/bolos/<int:id>", methods=['GET'])
def buscar_bolo(id):
    for bolo in bolos:
        if bolo['id'] == id:
            return jsonify(bolo)
    return jsonify({
        "erro": "Bolo não encontrado"
    }), 404


#calcular preco
@app.route("/calcular/", methods=["POST"])
def calcular_valor():

    dados = request.json

    valor_total = 0


    for bolo in bolos:

        if bolo["id"] == dados["bolo_id"]:


            for tamanho in bolo["tamanhos"]:
                if tamanho["id"] == dados["tamanho_id"]:
                    valor_total += tamanho["preco_base"]


            for sabor in bolo["sabores"]:
                if sabor["id"] == dados["sabor_id"]:
                    valor_total += sabor["preco_adicional"]


    return jsonify({
        "valor_total": valor_total
    })

@app.route('/pedidos/<int:id>', methods=['DELETE'])
def cancelar_pedido(id):
    for indice, pedido in enumerate(pedidos):
        if pedido.get('id') == id:
            del pedidos[indice]
            return jsonify({
        'mensagem': "Pedido cancelado com sucesso"
    })
    return jsonify ({
        'erro': 'Pedido não encontrado'
    }), 404








   









if __name__ == "__main__":
    app.run(debug=True)