/**
 * @typedef {Object} Country
 * @property {string} name - O nome do país em português brasileiro.
 * @property {string} code - O código ISO 3166-1 alpha-2 do país.
 * @property {string} region - O nome da região do país.
 * @property {string} capital_name - O nome da capital do país.
 * @property {string} continent - O continente onde o país está localizado.
 * @property {string} flag - A bandeira do país.
 */

/**
 * Classe para gerenciar a lógica do jogo de bandeiras.
 */
class Flags {
    /**
     * Lista de todos os países.
     * @type {Country[]}
     * @private
     */
    #allCountriesList = [];

    /**
     * Log de acertos do usuário.
     * @type {Country[]}
     */
    hitsLog = [];

    /**
     * Número de acertos do usuário.
     * @type {number}
     */
    hits = 0;

    /**
     * Log de tentativas do usuário.
     * @type {Country[]}
     */
    attemptLog = [];

    /**
     * Tentativa atual do usuário.
     * @type {number}
     * @private
     */
    #attempt = 1;

    /**
     * Número máximo de tentativas.
     * @type {number}
     * @private
     */
    #attemptMax = 5;

    /**
     * País atualmente selecionado.
     * @type {Country|undefined}
     * @private
     */
    #currentCountry;

    /**
     * Obtém o número atual de tentativas.
     * @returns {number} O número atual de tentativas.
     */
    getAttempt = () => this.#attempt;

    /**
     * Define o número atual de tentativas.
     * @param {number} value - O valor a ser definido para tentativas.
     */
    setAttempt = value => this.#attempt = value;

    /**
     * Obtém o número máximo de tentativas permitidas.
     * @returns {number} O número máximo de tentativas.
     */
    getAttemptMax = () => this.#attemptMax;

    /**
     * Retorna uma lista de todos os países.
     * @returns {Promise<Country[]>} Uma promessa que resolve com uma lista de todos os países.
     */
    getAllCountries = async () => {
        if (this.#allCountriesList.length === 0) {
            this.#allCountriesList = await fetch('./assets/json/countries.json').then(res => res.json());
        }

        return this.#allCountriesList;
    };

    /**
     * Retorna um país aleatório da lista.
     * @returns {Promise<Country>} Uma promessa que resolve com um país aleatório.
     */
    getRandomCountry = async () => {
        const countries = await this.getAllCountries();
        const index = Math.floor(Math.random() * countries.length);

        this.#currentCountry = countries[index];
        return this.#currentCountry;
    };

    /**
     * Retorna um país com base no código.
     * @param {string} code Código do país que se deseja recuperar.
     * @returns {Promise<Country|undefined>} Uma promessa que resolve com um país correspondente ao código.
     */
    getCountryByCode = code => this.#allCountriesList.find(item => item.code === code);

    /**
     * Retorna o nome do país atualmente selecionado.
     * @returns {Promise<string>} Uma promessa que resolve com o nome do país atual.
     */
    getCurrentCountryName = () => this.#currentCountry.name;

    /**
     * Retorna a dica 1, que é o continente do país.
     * @returns {Promise<string>} Uma promessa que resolve com a dica 1 (continente).
     */
    getTip1 = () => `Região: ${this.#currentCountry.region || 'Sem região'}`;

    /**
     * Retorna a dica 2, que é o nome da capital do país.
     * @returns {Promise<string>} Uma promessa que resolve com a dica 2 (capital).
     */
    getTip2 = () => `Capital: ${this.#currentCountry.capital_name || 'Sem capital'}`;

    /**
     * Retorna a dica 3, que é a quantidade de letras no nome do país.
     * @returns {Promise<string>} Uma promessa que resolve com a dica 3 (quantidade de letras).
     */
    getTip3 = () => `Quantidade de letras: ${this.#currentCountry.name.length}`;

    /**
     * Gera uma lista de opções HTML com todos os países.
     * @returns {Promise<string>} Uma promessa que resolve com uma string contendo as opções de países em HTML.
     */
    generateCountriesOptions = async () => {
        const countries = await this.getAllCountries();

        return countries.reduce((prev, current) => {
            return prev + `<option value="${current.code}">${current.name}</option>`;
        }, '<option value="" disabled selected>Escolha o país...</option>');
    };

    /**
     * Verifica se o código do país selecionado está correto.
     * @param {string} code - O código do país a ser verificado.
     * @returns {boolean} `true` se o código estiver correto, caso contrário `false`.
     */
    checkIfCountryIsCorrect = code => this.#currentCountry?.code === code;
}
