const conteudoPrincipal = document.querySelector('#conteudoPrincipal');
const linksDeSecao = [...document.querySelectorAll('[data-section]')];

async function carregarSecao(link, atualizarHistorico = true) {
    const arquivo = link.dataset.section;
    const titulo = link.querySelector('img')?.alt || link.textContent.trim();

    conteudoPrincipal.setAttribute('aria-busy', 'true');

    try {
        const resposta = await fetch(arquivo);

        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}`);
        }

        const html = await resposta.text();
        conteudoPrincipal.innerHTML = html.trim() || `
            <section class="secao-vazia">
                <h1>${titulo}</h1>
                <p>Conteúdo em breve.</p>
            </section>
        `;

        linksDeSecao.forEach((item) => item.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');

        if (atualizarHistorico) {
            history.pushState({ secao: link.hash }, '', link.hash);
        }

        conteudoPrincipal.focus({ preventScroll: true });
        conteudoPrincipal.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
