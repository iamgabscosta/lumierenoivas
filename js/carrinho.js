const chaveSacola = 'lumiere-sacola';
const abrirSacola = document.querySelector('#abrirSacola');
const fecharSacola = document.querySelector('#fecharSacola');
const fundoSacola = document.querySelector('#fundoSacola');
const painelSacola = document.querySelector('#painelSacola');
const listaSacola = document.querySelector('#listaSacola');
const sacolaVazia = document.querySelector('#sacolaVazia');
const totalSacola = document.querySelector('#totalSacola');
const irParaCheckout = document.querySelector('#irParaCheckout');
const linkCheckout = document.querySelector('#linkCheckout');

let sacola = carregarSacola();

function carregarSacola() {
    try {
        const dados = JSON.parse(localStorage.getItem(chaveSacola));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function salvarSacola() {
    localStorage.setItem(chaveSacola, JSON.stringify(sacola));
}

function formatarPreco(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function abrirPainelSacola() {
    fundoSacola.hidden = false;
    painelSacola.classList.add('aberto');
    painelSacola.setAttribute('aria-hidden', 'false');
    abrirSacola.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sacola-aberta');
    fecharSacola.focus();
}

function fecharPainelSacola() {
    painelSacola.classList.remove('aberto');
    painelSacola.setAttribute('aria-hidden', 'true');
    abrirSacola.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sacola-aberta');
    window.setTimeout(() => {
        fundoSacola.hidden = true;
    }, 250);
    abrirSacola.focus();
}

function renderizarSacola() {
    const total = sacola.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    const temItens = sacola.length > 0;

    listaSacola.innerHTML = sacola.map((item) => `
        <li class="item-sacola">
            <div>
                <p class="item-sacola-nome">${item.nome}</p>
                <p class="item-sacola-preco">${formatarPreco(item.preco)}</p>
            </div>
            <div class="item-sacola-acoes" aria-label="Quantidade de ${item.nome}">
                <button class="item-sacola-controle" type="button" data-acao="diminuir" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
                <span>${item.quantidade}</span>
                <button class="item-sacola-controle" type="button" data-acao="aumentar" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
            </div>
            <button class="item-sacola-remover" type="button" data-acao="remover" data-id="${item.id}">Remover</button>
        </li>
    `).join('');

    sacolaVazia.hidden = temItens;
    totalSacola.textContent = formatarPreco(total);
    irParaCheckout.disabled = !temItens;
    salvarSacola();
}

function atualizarQuantidade(id, alteracao) {
    const item = sacola.find((produto) => produto.id === id);
    if (!item) return;

    item.quantidade += alteracao;
    if (item.quantidade <= 0) {
        sacola = sacola.filter((produto) => produto.id !== id);
    }
    renderizarSacola();
}

function adicionarAoCarrinho(produto) {
    const item = {
        id: String(produto.id),
        nome: produto.nome,
        preco: Number(produto.preco),
        quantidade: Number(produto.quantidade) || 1
    };

    if (!item.id || !item.nome || !Number.isFinite(item.preco)) {
        throw new Error('Produto inválido para a sacola.');
    }

    const existente = sacola.find((produtoNaSacola) => produtoNaSacola.id === item.id);
    if (existente) {
        existente.quantidade += item.quantidade;
    } else {
        sacola.push(item);
    }

    renderizarSacola();
    abrirPainelSacola();
}

abrirSacola.addEventListener('click', abrirPainelSacola);
fecharSacola.addEventListener('click', fecharPainelSacola);
fundoSacola.addEventListener('click', fecharPainelSacola);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && painelSacola.classList.contains('aberto')) {
        fecharPainelSacola();
    }
});

listaSacola.addEventListener('click', (event) => {
    const botao = event.target.closest('[data-acao]');
    if (!botao) return;

    const { acao, id } = botao.dataset;
    if (acao === 'aumentar') atualizarQuantidade(id, 1);
    if (acao === 'diminuir') atualizarQuantidade(id, -1);
    if (acao === 'remover') {
        sacola = sacola.filter((produto) => produto.id !== id);
        renderizarSacola();
    }
});

irParaCheckout.addEventListener('click', () => {
    if (irParaCheckout.disabled) return;
    fecharPainelSacola();
    linkCheckout.click();
});

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.sacolaLumiere = {
    adicionar: adicionarAoCarrinho,
    listar: () => [...sacola]
};

renderizarSacola();
