const formBusca = document.querySelector('#formBusca');
const campoBusca = document.querySelector('#campoBusca');

const normalizar = (texto) => texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

formBusca.addEventListener('submit', (event) => {
    event.preventDefault();

    const termo = normalizar(campoBusca.value);
    const categorias = [...document.querySelectorAll('.navbar-links > a[href^="#"]')];
    const destino = categorias.find((link) => {
        const categoria = normalizar(link.textContent);
        return categoria.includes(termo) || termo.includes(categoria.replace(/s$/, ''));
    });

    if (!termo || !destino) {
        campoBusca.setCustomValidity(
            termo ? 'Categoria não encontrada.' : 'Digite uma categoria para pesquisar.'
        );
        campoBusca.reportValidity();
        return;
    }

    campoBusca.setCustomValidity('');
    document.querySelector(destino.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
});

campoBusca.addEventListener('input', () => campoBusca.setCustomValidity(''));
