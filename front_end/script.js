// Aponte para a sua API (troque pela URL real quando publicar)
const API_BASE = "http://localhost:5000";

// Cardápio de demonstração, usado caso a API ainda não esteja rodando/acessível
//const MOCK_BOLOS = [
/*  {
    id: 1, nome: "Bolo de Ninho com Nutella",
    descricao: "Massa fofinha, recheio de leite ninho e nutella.",
    sabores: [{id:1, nome:"Tradicional", preco_adicional:0}, {id:2, nome:"Com morango", preco_adicional:8}],
    tamanhos: [{id:1, nome:"Pequeno (10 fatias)", preco_base:80}, {id:2, nome:"Médio (20 fatias)", preco_base:140}]
  },
  {
    id: 2, nome: "Red Velvet",
    descricao: "Massa aveludada com cream cheese.",
    sabores: [{id:3, nome:"Tradicional", preco_adicional:0}],
    tamanhos: [{id:3, nome:"Pequeno (10 fatias)", preco_base:90}, {id:4, nome:"Médio (20 fatias)", preco_base:150}]
  },
  {
    id: 3, nome: "Bolo de Cenoura com Brigadeiro",
    descricao: "Clássico brasileiro, cobertura de brigadeiro cremoso.",
    sabores: [{id:4, nome:"Tradicional", preco_adicional:0}, {id:5, nome:"Brigadeiro de colher extra", preco_adicional:12}],
    tamanhos: [{id:5, nome:"Pequeno (10 fatias)", preco_base:65}, {id:6, nome:"Médio (20 fatias)", preco_base:115}]
  }*/
//];

let bolos = [];
let pedido = { bolo: null, sabor: null, tamanho: null };

const catalogoEl = document.getElementById('catalogo');
const contagemEl = document.getElementById('contagem');
const ticketEl = document.getElementById('ticket');
const ticketEmptyEl = document.getElementById('ticket-empty');
const ticketItemEl = document.getElementById('ticket-item');
const ticketStatusEl = document.getElementById('ticket-status');

async function carregarBolos(){
  try {
    const resp = await fetch(`${API_BASE}/bolos/`);
    if (!resp.ok) throw new Error('API indisponível');
    bolos = await resp.json();
    if (!bolos.length) throw new Error('sem bolos cadastrados');
  } catch (e) {
    bolos = MOCK_BOLOS; // fallback para você conseguir ver a tela funcionando
  }
  renderCatalogo();
}

function formatarPreco(v){
  return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
}

function renderCatalogo(){
  contagemEl.textContent = `${bolos.length} opções disponíveis`;
  catalogoEl.innerHTML = '';

  bolos.forEach(bolo => {
    const menorPreco = Math.min(...bolo.tamanhos.map(t => t.preco_base));

    const card = document.createElement('div');
    card.className = 'bolo-card';
    card.dataset.boloId = bolo.id;

    card.innerHTML = `
      <div class="bolo-swatch">${bolo.nome}</div>
      <h3>${bolo.nome}</h3>
      <p>${bolo.descricao || ''}</p>
      <div class="from">a partir de ${formatarPreco(menorPreco)}</div>
      <div class="config-row">
        <div>
          <label>Sabor</label>
          <select class="select-sabor">
            ${bolo.sabores.map(s => `<option value="${s.id}">${s.nome}${s.preco_adicional ? ' (+' + formatarPreco(s.preco_adicional) + ')' : ''}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Tamanho</label>
          <select class="select-tamanho">
            ${bolo.tamanhos.map(t => `<option value="${t.id}">${t.nome} — ${formatarPreco(t.preco_base)}</option>`).join('')}
          </select>
        </div>
      </div>
    `;

    card.addEventListener('click', (ev) => {
      // evita reabrir/fechar ao clicar dentro dos selects
      if (ev.target.tagName === 'SELECT') return;
      selecionarBolo(bolo.id);
    });

    const selSabor = card.querySelector('.select-sabor');
    const selTamanho = card.querySelector('.select-tamanho');
    selSabor.addEventListener('change', () => atualizarPedido(bolo.id));
    selTamanho.addEventListener('change', () => atualizarPedido(bolo.id));

    catalogoEl.appendChild(card);
  });
}

function selecionarBolo(boloId){
  document.querySelectorAll('.bolo-card').forEach(c => {
    c.classList.toggle('selected', Number(c.dataset.boloId) === boloId);
  });
  atualizarPedido(boloId);
}

function atualizarPedido(boloId){
  const bolo = bolos.find(b => b.id === boloId);
  const card = document.querySelector(`.bolo-card[data-bolo-id="${boloId}"]`);
  const saborId = Number(card.querySelector('.select-sabor').value);
  const tamanhoId = Number(card.querySelector('.select-tamanho').value);

  const sabor = bolo.sabores.find(s => s.id === saborId);
  const tamanho = bolo.tamanhos.find(t => t.id === tamanhoId);

  pedido = { bolo, sabor, tamanho };

  const total = tamanho.preco_base + (sabor.preco_adicional || 0);

  document.getElementById('tk-bolo').textContent = bolo.nome;
  document.getElementById('tk-sabor').textContent = sabor.nome;
  document.getElementById('tk-tamanho').textContent = tamanho.nome;
  document.getElementById('tk-total').textContent = formatarPreco(total);

  ticketEmptyEl.style.display = 'none';
  ticketItemEl.classList.add('active');
  ticketEl.classList.add('filled');
  ticketStatusEl.textContent = '#pronto';
}

document.getElementById('finalizar').addEventListener('click', finalizarPedido);
document.getElementById('adicionar-carrinho').addEventListener('click', adicionarCarrinho);

async function adicionarCarrinho(){

  if (!pedido.bolo){
    alert("Escolha um bolo primeiro.");
    return;
  }

  const item = {
    bolo_id: pedido.bolo.id,
    sabor_id: pedido.sabor.id,
    tamanho_id: pedido.tamanho.id,
    quantidade: 1
  };


  try {

    const resp = await fetch(`${API_BASE}/carrinho/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    });


    if (!resp.ok){
      throw new Error("Erro ao adicionar");
    }


    const data = await resp.json();

    alert(data.mensagem);


  } catch(error){

    alert("Não foi possível adicionar ao carrinho.");

  }

}

async function carregarCarrinho(){

  try{

    const resp = await fetch(`${API_BASE}/carrinho/`);
    const itens = await resp.json();
    const vazio = document.getElementById("ticket-empty");

if(itens.length === 0){
    vazio.style.display = "block";
} else {
    vazio.style.display = "none";
}

    const lista = document.getElementById("lista-carrinho");

    lista.innerHTML = "";

    let totalCarrinho = 0;


    itens.forEach(item => {

      const bolo = bolos.find(b => b.id === item.bolo_id);

      const sabor = bolo.sabores.find(s => s.id === item.sabor_id);

      const tamanho = bolo.tamanhos.find(t => t.id === item.tamanho_id);


      const subtotal = (tamanho.preco_base + sabor.preco_adicional) * item.quantidade;

      totalCarrinho += subtotal;


      lista.innerHTML += `
        <div class="item-carrinho">
          <strong>${bolo.nome}</strong><br>
          Sabor: ${sabor.nome}<br>
          Tamanho: ${tamanho.nome}<br>
          Quantidade: ${item.quantidade}<br>
          Subtotal: ${formatarPreco(subtotal)}
        </div>
        <hr>
      `;

    });


    lista.innerHTML += `
      <h3>Total: ${formatarPreco(totalCarrinho)}</h3>
    `;


  }catch(error){

    console.log(error);

  }

}

async function finalizarPedido(){
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const entrega = document.getElementById('entrega').value;
  const obs = document.getElementById('obs').value.trim();
  const statusEl = document.getElementById('status-msg');
  const botao = document.getElementById('finalizar');

  statusEl.className = '';
  if (!pedido.bolo){ statusEl.textContent = 'Escolha um bolo primeiro.'; statusEl.className='erro'; return; }
  if (!nome || !telefone){ statusEl.textContent = 'Preencha nome e telefone.'; statusEl.className='erro'; return; }

  botao.disabled = true;
  statusEl.textContent = 'Gerando link de pagamento…';

  const payload = {
    cliente_nome: nome,
    cliente_telefone: telefone,
    bolo_id: pedido.bolo.id,
    sabor_id: pedido.sabor.id,
    tamanho_id: pedido.tamanho.id,
    observacoes: obs || null,
    data_entrega: entrega ? new Date(entrega).toISOString() : null
  };

  try {
    const resp = await fetch(`${API_BASE}/pedidos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error('Falha ao criar pedido');
    const data = await resp.json();

    statusEl.textContent = 'Redirecionando para o pagamento…';
    window.location.href = data.checkout_url;
  } catch (e) {
    statusEl.textContent = 'Não foi possível conectar com a API. Confira se ela está rodando em ' + API_BASE + '.';
    statusEl.className = 'erro';
    botao.disabled = false;
  }
}

carregarBolos();
carregarCarrinho();