# Desafio das Bandeiras

## Descrição

O "Desafio das Bandeiras" é um jogo interativo de adivinhação de bandeiras de países. O objetivo do jogo é testar o seu conhecimento sobre as bandeiras e aprender mais sobre os países ao redor do mundo. O jogo exibe uma bandeira e você deve adivinhar qual é o país correspondente selecionando uma opção de um menu suspenso.

## Funcionalidades

- **Exibição de Bandeiras**: Mostra uma bandeira aleatória de um país.
- **Dicas**: Fornece três dicas para ajudar na identificação do país:
  1. Região do país.
  2. Nome da capital do país.
  3. Quantidade de letras no nome do país.
- **Seleção de País**: Permite ao usuário selecionar o país correspondente a partir de um menu suspenso.
- **Contagem de Tentativas**: Mostra o número de tentativas restantes e os acertos do usuário.
- **Logs**: Registra as tentativas e acertos do usuário, exibindo um log acessível através de um modal.
- **Navegação**: Oferece uma opção para pular para a próxima bandeira.

## Estrutura do Projeto

- `index.html`: Arquivo HTML principal que define a estrutura e o layout do jogo.
- `js/Flags.class.js`: Arquivo JavaScript que contém a classe `Flags`, que gerencia a lógica do jogo.
- `js/main.js`: Arquivo JavaScript para manipulação de eventos e interação com a interface do usuário.
- `assets/`: Diretório que contém imagens e dados JSON utilizados pelo jogo.

## Instalação

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd <NOME_DO_DIRETÓRIO>
   ```

2. Abra o arquivo `index.html` em um navegador para iniciar o jogo.

## Uso

1. Ao carregar a página, uma bandeira será exibida.
2. Use o menu suspenso para selecionar o país que corresponde à bandeira exibida.
3. Clique no botão "Verificar" para enviar sua resposta.
4. Utilize as dicas fornecidas para ajudar na identificação do país.
5. Após cada tentativa, o jogo exibirá o número de tentativas restantes e registrará suas respostas.

## Arquivos

### `js/Flags.class.js`

Este arquivo contém a classe `Flags`, que é responsável pela lógica do jogo. Aqui estão alguns dos métodos principais:

- `getAllCountries()`: Retorna uma lista de todos os países.
- `getRandomCountry()`: Retorna um país aleatório.
- `getCountryByCode(code)`: Retorna um país baseado no código.
- `getCurrentCountryName()`: Retorna o nome do país atualmente selecionado.
- `getTip1()`, `getTip2()`, `getTip3()`: Fornecem dicas sobre o país atual.
- `generateCountriesOptions()`: Gera opções HTML para o menu suspenso.
- `checkIfCountryIsCorrect(code)`: Verifica se o código do país selecionado está correto.

### `js/main.js`

Este arquivo contém o código JavaScript que interage com a interface do usuário, incluindo a manipulação de eventos e a atualização da interface com base na lógica do jogo.

### `index.html`

Define a estrutura da interface do usuário, incluindo:

- Exibição da bandeira.
- Menu suspenso para seleção do país.
- Botões para obter dicas e pular para a próxima bandeira.
- Modal para exibir o log de acertos.

## Tecnologias Utilizadas

- **HTML**: Estrutura da página.
- **CSS**: Estilização da interface (Bootstrap, Fontes do Google).
- **JavaScript**: Lógica do jogo e manipulação da interface (jQuery, Bootstrap, Toastify, SweetAlert2).

## Contribuições

Contribuições são bem-vindas! Se você deseja contribuir para o projeto, por favor, faça um fork do repositório, faça suas alterações e envie um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

Desenvolvido por [Alan Teles](https://github.com/TelesAlan). Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para me contatar.