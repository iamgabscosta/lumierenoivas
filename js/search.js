const formBusca = document.querySelector('#formBusca');
const campoBusca = document.querySelector('#campoBusca');

const normalizar = (texto) => texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const normalizarCategoria = (texto) => normalizar(texto).replace(/s$/, '');

const termosPorCategoria = {
    '#noivas': [
        'noiva', 'vestido', 'casamento', 'noivado', 'cerimonia', 'sonho',
        'grande dia', 'historia', 'amor', 'elegancia', 'delicadeza', 'sofisticacao',
        'escolha', 'momento', 'especial', 'inesquecivel', 'emocao', 'carinho',
        'dedicacao', 'memoravel', 'modelo', 'modelos', 'altar', 'veu', 'branco'
    ],
    '#festa': [
        'festa', 'madrinha', 'formatura', 'baile', 'convidada', 'mae da noiva',
        'vestido', 'look', 'celebracao', 'evento', 'charme', 'elegancia', 'sofisticacao',
        'ocasiao', 'especial', 'beleza', 'momentos', 'memoria', 'noite', 'vestir',
        'convidadas', 'dama', 'destaque', 'glamour', 'madrinhas'
    ],
    '#debutantes': [
        'debutante', '15 anos', 'quinze anos', 'aniversario', 'adolescente',
        'princesa', 'festa', 'vestido', 'sonho', 'personalidade', 'celebracao',
        'nova fase', 'momento', 'emocao', 'descoberta', 'descobertas', 'experiencia',
        'vida', 'especial', 'marcante', 'magico', 'magica', 'glamour', 'noite',
        'modelos', 'charme', 'brilhar', 'aniversariante'
    ],
    '#ternos': [
        'terno', 'noivo', 'traje', 'masculino', 'homem', 'smoking', 'paleto',
        'gravata', 'casamento', 'cerimonia', 'classico', 'elegancia', 'estilo',
        'caimento', 'conforto', 'personalidade', 'personalizar', 'grande dia',
        'contemporaneo', 'moderno', 'celebrar', 'terno azul', 'terno marrom',
        'terno terracota', 'roupa masculina', 'padrinho'
    ]
};

function pontuarCategoria(termo, link) {
    const palavras = [...new Set(termo.split(/\s+/).map(normalizarCategoria))];
    const termos = [
        normalizarCategoria(link.textContent),
        ...(termosPorCategoria[link.hash] || []).map(normalizarCategoria)
    ];

    return palavras.reduce((pontuacao, palavra) => {
        return pontuacao + (termos.some((item) =>
            item.split(/\s+/).includes(palavra)
        ) ? 1 : 0);
    }, 0);
}

formBusca.addEventListener('submit', (event) => {
    event.preventDefault();

    const termo = normalizar(campoBusca.value);
    const categorias = [...document.querySelectorAll('.navbar-links > a[data-section]')];
    const destino = categorias
        .map((link) => ({ link, pontuacao: pontuarCategoria(termo, link) }))
        .filter((resultado) => resultado.pontuacao > 0)
        .sort((a, b) => b.pontuacao - a.pontuacao)[0]?.link;

    if (!termo || !destino) {
        campoBusca.setCustomValidity(
            termo
                ? 'Não encontramos uma categoria para esse termo. Tente buscar por vestidos, casamento, festa, 15 anos ou terno.'
                : 'Digite uma categoria para pesquisar.'
        );
        campoBusca.reportValidity();
        return;
    }

    campoBusca.setCustomValidity('');
    destino.click();
});

campoBusca.addEventListener('input', () => campoBusca.setCustomValidity(''));
