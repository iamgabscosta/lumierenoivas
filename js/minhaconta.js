function configurarMinhaConta() {
    const formLogin = document.querySelector('#formLogin');
    const formCadastro = document.querySelector('#formCadastro');

    if (!formLogin || !formCadastro) return;

    const mensagemLogin = document.querySelector('#mensagemLogin');
    const aceitarTermos = document.querySelector('#aceitarTermos');
    const botaoCriarConta = document.querySelector('#botaoCriarConta');
    const mensagemCadastro = document.querySelector('#mensagemCadastro');
    const abrirRecuperarSenha = document.querySelector('#abrirRecuperarSenha');
    const dialogRecuperarSenha = document.querySelector('#dialogRecuperarSenha');
    const fecharRecuperarSenha = document.querySelector('#fecharRecuperarSenha');
    const cancelarRecuperacao = document.querySelector('#cancelarRecuperacao');
    const formRecuperarSenha = document.querySelector('#formRecuperarSenha');
    const emailRecuperacao = document.querySelector('#emailRecuperacao');
    const mensagemRecuperacao = document.querySelector('#mensagemRecuperacao');

    function atualizarBotaoCadastro() {
        botaoCriarConta.disabled = !aceitarTermos.checked;
    }

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!formLogin.reportValidity()) return;
        mensagemLogin.textContent = 'Login validado e pronto para integração.';
    });

    aceitarTermos.addEventListener('change', atualizarBotaoCadastro);
    atualizarBotaoCadastro();

    abrirRecuperarSenha.addEventListener('click', () => {
        dialogRecuperarSenha.showModal();
        emailRecuperacao.focus();
    });

    [fecharRecuperarSenha, cancelarRecuperacao].forEach((botao) => {
        botao.addEventListener('click', () => dialogRecuperarSenha.close());
    });

    formRecuperarSenha.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!formRecuperarSenha.reportValidity()) return;

        mensagemRecuperacao.textContent = 'Solicitação validada e pronta para envio.';
    });

    formCadastro.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!formCadastro.reportValidity()) return;

        mensagemCadastro.textContent = 'Cadastro validado e pronto para envio.';
    });
}

window.configurarMinhaConta = configurarMinhaConta;
