/**
 * Instância da classe Flags para gerenciar a lógica do jogo de bandeiras.
 * @type {Flags}
 */
const flag = new Flags();

/**
 * Elementos HTML usados no jogo.
 * @type {Object}
 * @property {HTMLSelectElement} selectFlag - O elemento select para escolha de bandeiras.
 * @property {HTMLImageElement} imgFlag - O elemento de imagem para exibir a bandeira.
 * @property {HTMLFormElement} formFlag - O formulário para enviar a resposta.
 * @property {HTMLButtonElement} btnSubmit - O botão para submeter a resposta.
 * @property {HTMLButtonElement} btnNext - O botão para avançar para a próxima bandeira.
 * @property {HTMLButtonElement} btnTip1 - O botão para a primeira dica.
 * @property {HTMLButtonElement} btnTip2 - O botão para a segunda dica.
 * @property {HTMLButtonElement} btnTip3 - O botão para a terceira dica.
 * @property {HTMLElement} counterFlag - O elemento para exibir o contador de acertos.
 * @property {HTMLElement} attemptFlag - O elemento para exibir as tentativas restantes.
 * @property {HTMLElement} attemptLog - O elemento para exibir o log de tentativas.
 * @property {HTMLElement} hitsLog - O elemento para exibir o log de acertos.
 * @property {HTMLElement} modalHitsLog - O elemento do modal para exibir os acertos.
 */
const elements = {
    selectFlag: document.getElementById('select_flag'),
    imgFlag: document.getElementById('img_flag'),
    formFlag: document.getElementById('form_flag'),
    btnSubmit: document.getElementById('btn-submit'),
    btnNext: document.getElementById('btn-next'),
    btnTip1: document.getElementById('btn-tip-1'),
    btnTip2: document.getElementById('btn-tip-2'),
    btnTip3: document.getElementById('btn-tip-3'),
    counterFlag: document.getElementById('counter_flag'),
    attemptFlag: document.getElementById('attemp_flag'),
    attemptLog: document.getElementById('attemp_log'),
    hitsLog: document.getElementById('hits_log'),
    modalHitsLog: document.getElementById('modalHitsLog'),
};

/**
 * Inicializa os eventos de interação com a interface do usuário.
 */
const initializeEvents = () => {
    elements.imgFlag.addEventListener('error', handleImageError);
    elements.selectFlag.addEventListener('change', handleSelectChange);
    elements.btnNext.addEventListener('click', handleNextButtonClick);
    elements.formFlag.addEventListener('submit', handleFormSubmit);

    $('#modalHitsLog').on('hidden.bs.modal', () => {
        elements.hitsLog.innerHTML = '<p class="text-center m-0 text-muted">Ainda não encontramos nenhum acerto.</p>';
    }).on('show.bs.modal', generateHitsLog);
};

/**
 * Manipula o erro de carregamento da imagem da bandeira.
 */
const handleImageError = () => {
    elements.imgFlag.setAttribute('src', './assets/img/image.png');
    generateRandomCountryCard();
};

/**
 * Manipula a mudança do select de países.
 * @param {Event} ev - Evento de mudança.
 */
const handleSelectChange = (ev) => {
    elements.btnSubmit.disabled = !ev.target.value;
};

/**
 * Manipula o clique no botão de próxima bandeira.
 */
const handleNextButtonClick = async () => {
    if(flag.hits > 0){
        const { isConfirmed } = await Swal.fire({
            title: `Atenção!`,
            text: `Ao avançar, você irá perder sua sequência de acertos! Tem certeza que deseja fazer isso?`,
            icon: 'warning',
            confirmButtonText: 'Sim! Vamos para a próxima.',
            showCancelButton: true,
            cancelButtonText: 'Não! Vou tentar adivinhar essa.'
        });
        if(!isConfirmed) return;
    }

    generateToast(`A bandeira pertencia ao país "${await flag.getCurrentCountryName()}"`, '#23395B');

    resetGame({ resetHit: true });
};

/**
 * Manipula o envio do formulário de resposta.
 * @param {Event} ev - Evento de submissão do formulário.
 */
const handleFormSubmit = async (ev) => {
    ev.preventDefault();
    const selectValue = elements.selectFlag.value;

    if (!selectValue) {
        generateToast('Escolha o país para continuar', '#DF2935');
        return;
    }

    elements.selectFlag.value = "";
    elements.btnSubmit.setAttribute('disabled', 'disabled');
    $('select').selectpicker('refresh');

    const currentCountry = flag.getCountryByCode(selectValue);

    if (flag.checkIfCountryIsCorrect(selectValue)) {
        await Swal.fire({
            title: `Bandeira correta!`,
            text: `Parabéns! Você acertou a bandeira! Que tal tentar a próxima?`,
            icon: 'success',
            confirmButtonText: 'Vamos para a próxima!'
        });
        flag.hitsLog.push(currentCountry);
        flag.hits++;
        resetGame({ resetHit: false });
    } else {
        if (flag.getAttempt() >= flag.getAttemptMax()) {
            resetGame({ resetHit: true, showMessageEndGame: true });
        } else { // ainda tem chances de acertar
            disableSelectOption(selectValue);

            flag.attemptLog.push(currentCountry);
            flag.setAttempt(flag.getAttempt() + 1);
            generateAttemptInfo();
            generateAttemptLog();
        }
    }
};

/**
 * Desabilita opções no select com base nos valores fornecidos.
 * @param {string[]} valuesToDisable - Lista de valores das opções a serem desabilitadas.
 */
const disableSelectOption = (valuesToDisable) => {
    for (let i = 0; i < elements.selectFlag.options.length; i++) {
        const option = elements.selectFlag.options[i];

        // Verifica se o valor da opção está na lista de valores para desabilitar
        if (valuesToDisable.includes(option.value)) {
            option.disabled = true; // Desabilita a opção
        }
    }
    $('select').selectpicker('refresh');
};

/**
 * Habilita todas as opções no select.
 */
const enableAllOptions = () =>  {
    for (let i = 0; i < elements.selectFlag.options.length; i++) {
        const option = elements.selectFlag.options[i];
        option.disabled = false;
    }
    $('select').selectpicker('refresh');
};

/**
 * Reinicia o jogo com as configurações fornecidas.
 * @param {Object} options - Opções para reiniciar o jogo.
 * @param {boolean} options.resetHit - Se verdadeiro, o contador de acertos é reiniciado.
 * @param {boolean} options.showMessageEndGame - Se verdadeiro, mostra uma mensagem de game over.
 */
const resetGame = async ({ resetHit, showMessageEndGame }) => {
    if (resetHit) {
        flag.hits = 0;
        flag.hitsLog = [];
    }
    if (showMessageEndGame){
        await Swal.fire({
            title: `A bandeira pertence ao país "${await flag.getCurrentCountryName()}"`,
            text: `Suas tentativas para essa bandeira acabaram! Mas não desanime, o desafio continua!`,
            icon: 'info',
            confirmButtonText: 'Tudo bem! Vamos para a próxima!'
        });
    }

    flag.setAttempt(1);

    flag.attemptLog = []; 

    enableAllOptions();
    generateAttemptInfo();
    generateAttemptLog();
    generateHitsInfo();
    generateRandomCountryCard();
};

/**
 * Gera uma nova imagem da bandeira e atualiza as dicas.
 * Atualiza o popover com as dicas correspondentes.
 */
const generateRandomCountryCard = async () => {
    try {
        const country = await flag.getRandomCountry();
        elements.imgFlag.setAttribute('src', `https://flagcdn.com/h240/${country.code.toLowerCase()}.png`);

        // Inicia o popover
        $('[data-toggle="tooltip"]').tooltip('dispose');

        elements.btnTip1.setAttribute('title', await flag.getTip1());
        elements.btnTip2.setAttribute('title', await flag.getTip2());
        elements.btnTip3.setAttribute('title', await flag.getTip3());

        $('[data-toggle="tooltip"]').tooltip('update');
    } catch (error) {
        console.error('Erro ao gerar o cartão da bandeira:', error);
        generateToast('Erro ao carregar a bandeira', '#DF2935');
    }
};

/**
 * Atualiza a exibição do contador de acertos.
 */
const generateHitsInfo = () => {
    const message = `Você está em uma sequência de <a href="#" data-toggle="modal" data-target="#modalHitsLog">${flag.hits} acerto${flag.hits === 1 ? '' : 's'}</a>!`;
    elements.counterFlag.innerHTML = `<small class="text-muted">${message}</small>`;
};

/**
 * Atualiza a exibição das tentativas restantes.
 */
const generateAttemptInfo = () => {
    const message = `Tentativa ${flag.getAttempt()} de ${flag.getAttemptMax()}`;
    elements.attemptFlag.innerHTML = `<small><strong>${message}</strong></small>`;
};

/**
 * Atualiza a exibição dos logs de tentativas.
 */
const generateAttemptLog = () => {
    if(flag.attemptLog.length > 0){
        const html = flag.attemptLog.reduce((prev, current, index) => {
            return prev + `
                <li class="list-group-item d-flex align-item-center" style="gap: 10px">
                    <img src="https://hatscripts.github.io/circle-flags/flags/${current.flag}.svg" width="24" />
                    ${current.name}
                </li>
            `;
        }, "");

        elements.attemptLog.innerHTML = html;
        elements.attemptLog.classList.remove('d-none');
    }else{
        elements.attemptLog.innerHTML = '';
        elements.attemptLog.classList.add('d-none');
    }
};

/**
 * Atualiza a exibição dos logs de acertos.
 */
const generateHitsLog = () => {
    elements.hitsLog.innerHTML = '<p class="text-center m-0 text-muted">Ainda não encontramos nenhum acerto.</p>';

    if(flag.hitsLog.length > 0){
        const html = flag.hitsLog.reduce((prev, current, index) => {
            return prev + `
                <li class="list-group-item d-flex align-item-center" style="gap: 10px">
                    <img src="https://hatscripts.github.io/circle-flags/flags/${current.flag}.svg" width="24" />
                    ${current.name}
                </li>
            `;
        }, '<ul class="list-group">') + '</ul>';

        elements.hitsLog.innerHTML = html;
    }
};

/**
 * Exibe uma notificação Toast com a mensagem fornecida.
 * @param {string} text - Texto da notificação.
 * @param {string} background - Cor de fundo da notificação.
 */
const generateToast = (text, background) => {
    Toastify({
        text,
        duration: 3000,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: { background }
    }).showToast();
};

// Inicializa o jogo e configura os eventos
(async () => {
    elements.selectFlag.innerHTML = await flag.generateCountriesOptions();
    elements.selectFlag.removeAttribute('disabled');
    $('select').selectpicker();

    generateRandomCountryCard();
    generateHitsInfo();
    generateAttemptInfo();
    generateAttemptLog();
    initializeEvents();
})();
