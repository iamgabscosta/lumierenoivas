const conteudoPrincipal = document.querySelector('#conteudoPrincipal');
const linksDeSecao = [...document.querySelectorAll('[data-section]')];
const logoNavbar = document.querySelector('.navbar-logo img');
const logoLumiere = 'assets/logo/logo.png';
const logoVizzore = 'assets/logo/VizzoreLogo.png';

function atualizarLogoNavbar(ehNoivos) {
    if (!logoNavbar) return;

    logoNavbar.src = ehNoivos ? logoVizzore : logoLumiere;
    logoNavbar.alt = ehNoivos ? 'Logo Vizzore' : 'Logo Lumière Noivas';
}

function configurarCamposIndicacao() {
    const origemContato = conteudoPrincipal.querySelector('#ondevoceconheceLumiere');
    const camposIndicacao = [...conteudoPrincipal.querySelectorAll('[data-campo-indicacao]')];
    const camposOutros = [...conteudoPrincipal.querySelectorAll('[data-campo-outros]')];

    if (!origemContato) return;

    function alternarCampos(campos, mostrar) {
        campos.forEach((grupo) => {
            grupo.hidden = !mostrar;
            const campo = grupo.querySelector('input');
            campo.required = mostrar;

            if (!mostrar) campo.value = '';
        });
    }

    function atualizarCamposIndicacao() {
        alternarCampos(camposIndicacao, origemContato.value === 'indicacao');
        alternarCampos(camposOutros, origemContato.value === 'outros');
    }

    origemContato.addEventListener('change', atualizarCamposIndicacao);
    atualizarCamposIndicacao();
}

async function carregarSecao(link, atualizarHistorico = true) {
    const arquivo = link.dataset.section;
    const titulo = link.hash === '#noivos'
        ? 'Noivos'
        : link.querySelector('img')?.alt || link.textContent.trim();
    const paginaSemBarra = [
        '#contato',
        '#minhaconta',
        '#politicaprivacidade',
        '#termosdeuso',
        '#comprasentregas',
        '#trocasdevolucoes'
    ].includes(link.hash);

    const ehNoivos = link.hash === '#noivos';
    document.documentElement.classList.toggle('tema-noivos', ehNoivos);
    atualizarLogoNavbar(ehNoivos);
    document.documentElement.classList.toggle('pagina-sem-scrollbar', paginaSemBarra);
    conteudoPrincipal.setAttribute('aria-busy', 'true');

    try {
        const resposta = await fetch(arquivo);

        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}`);
        }

        const html = await resposta.text();
        window.scrollTo(0, 0);
        conteudoPrincipal.classList.remove('section-visible');
        conteudoPrincipal.innerHTML = html.trim() || `
            <section class="secao-vazia">
                <h1>${titulo}</h1>
                <p>Conteúdo em breve.</p>
            </section>
        `;
        requestAnimationFrame(() => conteudoPrincipal.classList.add('section-visible'));
        configurarCamposIndicacao();
        window.configurarMinhaConta?.();

        linksDeSecao.forEach((item) => item.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');

        if (atualizarHistorico) {
            history.pushState({ secao: link.hash }, '', link.hash);
        }
        conteudoPrincipal.focus({ preventScroll: true });
    } catch (erro) {
        conteudoPrincipal.innerHTML = `
            <section class="secao-erro" role="alert">
                <h1>Não foi possível carregar ${titulo}</h1>
                <p>Abra o projeto por um servidor local e tente novamente.</p>
            </section>
        `;
        console.error('Falha ao carregar seção:', erro);
    } finally {
        conteudoPrincipal.removeAttribute('aria-busy');
    }
}

linksDeSecao.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        carregarSecao(link);
    });
});

function carregarPeloHash() {
    const link = linksDeSecao.find((item) => item.hash === window.location.hash);
    if (link) carregarSecao(link, false);
}

window.addEventListener('popstate', carregarPeloHash);
carregarPeloHash();
