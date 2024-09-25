# Assistente de Suporte TI via WhatsApp
<img src="https://github.com/user-attachments/assets/10d68bf1-1e56-484f-b195-f7f688489fbb" alt="image" width="300"/>


![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green) ![NPM](https://img.shields.io/badge/NPM-v6.14.4-red) ![venom-bot](https://img.shields.io/badge/Venom--bot-v3.1.9-blue)

## Descrição
Este projeto é um sistema de atendimento automatizado via **WhatsApp** que utiliza a biblioteca **[venom-bot](https://www.npmjs.com/package/venom-bot)**. 

Ele simula uma assistente virtual chamada **Amanda**, que coleta informações sobre equipamentos de TI com defeitos. As interações são armazenadas em um arquivo JSON para serem utilizadas posteriormente e podem ser integradas futuramente com um banco de dados para armazenar os chamados atendidos pelo assistente.

---

## Funcionalidades
- **Atendimento automatizado**: O bot responde automaticamente a mensagens enviadas por usuários.
- **Suporte a múltiplos dispositivos**: O bot pode ser usado em diferentes dispositivos, mantendo a sessão ativa.
- **Fluxo de coleta de informações**: O usuário fornece dados através de mensagens de texto, como:
  - Nome
  - Unidade
  - Número de série do equipamento
  - Defeito do equipamento
  - Setor onde o equipamento está localizado
  - Contato responsável
- **Revisão e edição**: O usuário pode revisar e alterar as informações antes de finalizar o atendimento.
- **Armazenamento local**: Todos os atendimentos são armazenados no arquivo `attendances.json`.
- **Controle de sessões concluídas**: Evita que um mesmo contato seja atendido mais de uma vez.

---

## Requisitos

Para rodar o projeto, é necessário ter:
- **Node.js** (versão 14 ou superior)
- NPM (gerenciador de pacotes do Node.js)

---

## Instalação

### 1. Clone o repositório para o seu ambiente local:
-  git clone https://github.com/Lucasapn2/Assistente-Bot-Ti.git

### 2. Instale as dependências necessárias:
- npm install venom-bot

## Como Executar

1. Execute o comando abaixo para iniciar o bot:
   - `node index.js`
    
2. **Configuração do Bot**  
   O Venom Bot é inicializado com as seguintes configurações:

```javascript
venom
  .create({
    session: 'session-name', // Nome da sessão
    multidevice: true, // Suporte a multi-dispositivos
    headless: false, // Navegador invisível
    logQR: false, // Desativa o log do QR code no terminal
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // Argumentos adicionais
  })
  .then((client) => start(client))
  .catch((error) => console.error(error)); // Lida com erros de inicialização
```
## 2. O Venom Bot irá:
- Criar uma nova sessão no WhatsApp com base no QR code que será gerado na primeira execução.
  ![image](https://github.com/user-attachments/assets/59db6536-3fee-4579-b5d5-0ee18431bd22)

- Armazenar os dados da sessão do Whatsapp localmente para manter a conexão ativa.
![image](https://github.com/user-attachments/assets/26e5532e-c921-455d-befa-d00fac0333f5)


## 3. Interaja com o bot:
- Ao enviar uma mensagem para o bot, ele responderá automaticamente, solicitando informações de forma interativa.
- O atendimento será concluído após a revisão dos dados coletados e os dados serão salvos no arquivo attendances.json.

  ## Estrutura do Projeto
- index.js: Arquivo principal que inicializa o Venom Bot e define o fluxo de atendimento.
- attendances.json: Arquivo JSON que armazena os atendimentos concluídos.

## Detalhes do Fluxo de Atendimento

1. **Boas-vindas**: O bot se apresenta e pergunta o nome do cliente.
2. **Informações do Chamado**:
   - Nome da unidade
   - Número de série do equipamento
   - Defeito
   - Setor onde o equipamento está
   - Contato responsável
3. **Revisão**: O cliente revisa os dados e pode corrigir qualquer informação antes de finalizar o chamado.
4. **Finalização**: Após a confirmação, o atendimento é salvo e a sessão é encerrada para este chat.

## Armazenamento dos Atendimentos

Os atendimentos são armazenados no arquivo `attendances.json`, que contém um array de objetos no seguinte formato:

```json
[
  {
    "chatId": "5511999999999@c.us",
    "session": {
      "nomeCliente": "João",
      "unidade": "Unidade X",
      "numSerie": "12345",
      "defeito": "Tela quebrada",
      "setor": "TI",
      "contatoResponsavel": "Maria - (11) 99999-9999"
    }
  }
]
```
## Estrutura do JSON:
- chatId: Identificação única do chat no WhatsApp.
- session: Dados coletados durante o atendimento, incluindo o nome do cliente, unidade, número de série do equipamento, defeito, setor e o contato responsável.
## Estrutura do Projeto

📁 whatsapp-atendimento-bot  
├── 📄 index.js            # Arquivo principal que inicializa o bot e define o fluxo de atendimento  
├── 📄 attendances.json    # Armazena os atendimentos concluídos  
└── 📄 package.json        # Gerenciador de dependências e scripts do projeto  

## Exemplo de Conversa

**Bot:** Olá! Sou **Amanda**, sua assistente de suporte. Qual é seu nome?  

**Usuário:** João  

**Bot:** Obrigado, **João**! Qual é o nome da unidade que precisa de atendimento?  

**Usuário:** Unidade X  

**Bot:** Qual é o número de série do equipamento?  

**Usuário:** 12345  

**Bot:** Qual é o defeito do equipamento?  

**Usuário:** A tela não liga.  

**Bot:** Em que setor o equipamento está?  

**Usuário:** TI  

**Bot:** Quem é o responsável pelo equipamento? Informe o nome e contato.  

**Usuário:** Maria - (11) 99999-9999  

**Bot:** Aqui estão os dados do seu chamado:  
- **Nome:** João  
- **Unidade:** Unidade X  
- **Número de Série:** 12345  
- **Defeito:** A tela não liga  
- **Setor:** TI  
- **Contato:** Maria - (11) 99999-9999  

**Bot:** Está tudo certo? Se precisar alterar, responda com o número correspondente:  
1. Nome  
2. Unidade  
3. Número de Série  
4. Defeito  
5. Setor  
6. Contato  
7. Tudo Ok  

**Usuário:** 7  

**Bot:** Obrigado, **João**! Seu atendimento será agendado. Até mais!

## Tecnologias Utilizadas
- [Node.js](https://nodejs.org/) - Ambiente de execução para JavaScript.
- [Venom Bot](https://github.com/orkestral/venom) - Biblioteca para automação de WhatsApp.
- [fs](https://nodejs.org/api/fs.html) - Módulo nativo do Node.js para manipulação de arquivos.

## Personalização

- Você pode personalizar o fluxo de atendimento ajustando o código no arquivo index.js. Adicione novas perguntas ou altere o comportamento do bot conforme as suas necessidades.

## Considerações Finais
- O bot foi desenvolvido para funcionar de forma local, mas pode ser adaptado para integrar com APIs externas, como bancos de dados ou plataformas de atendimento.
- Importante: Mantenha a sessão ativa no WhatsApp para que o bot continue funcionando corretamente.

## Dependências 
- venom-bot: Biblioteca para comunicação com WhatsApp via API não oficial.
- fs: Módulo nativo do Node.js para manipulação de arquivos
