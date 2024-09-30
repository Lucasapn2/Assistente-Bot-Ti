// biblioteca Venom 
const venom = require('venom-bot');
// fs para manipulação de arquivos
const fs = require('fs');
// caminho do arquivo onde os atendimentos serão armazenados obs: em JSON attendances.json
const path = './attendances.json';

// Inicializa o Venom Bot
venom
  .create({
    session: 'session-name', // Nome da sessão
    multidevice: true, // Suporte a multi-dispositivos
    headless: false, // Mantenha o navegador visível para debug OU coloque True para não aparecer
    logQR: false, // Desativa o log de QR code no terminal
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // Argumentos adicionais para o navegador
  })
  .then((client) => {
    console.log('Venom conectado!');
    start(client); // Inicia o bot após conexão do QRCODE
  })
  .catch((error) => console.log(error)); // logs para lidar com erros de inicialização 

// Armazena dados de sessão temporários
const sessionData = {};

// Conjunto de sessões concluídas, inicializado com dados do arquivo JSON
const completedSessions = new Set(readAttendances().map(attendance => attendance.chatId));

// Função para ler atendimentos do arquivo JSON
function readAttendances() {
  if (fs.existsSync(path)) { // Verifica se o arquivo existe
    const data = fs.readFileSync(path); // Lê os dados do arquivo
    return JSON.parse(data); // Converte os dados de JSON para objeto
  }
  return []; // Retorna um array vazio se o arquivo não existir 
}

// Função para escrever atendimentos no arquivo JSON
function writeAttendances(attendances) {
  fs.writeFileSync(path, JSON.stringify(attendances, null, 2)); // Escreve os dados no arquivo de forma formatada
}

// Função para salvar um atendimento no arquivo JSON
function saveAttendance(chatId, session) {
  const attendances = readAttendances(); // Lê os atendimentos existentes
  attendances.push({ chatId, session }); // Adiciona o novo atendimento
  writeAttendances(attendances); // Escreve os dados atualizados no arquivo
}

// Função principal do bot
function start(client) {
  client.onMessage(async (message) => {
    const chatId = message.from; // ID do chat de onde a mensagem foi recebida
    const isGroup = chatId.includes('@g.us'); // Verifica se a mensagem é de um grupo
    const msg = message.body ? message.body.trim() : ''; // Obtém o texto da mensagem

    console.log(`Mensagem recebida de ${chatId}: ${msg}`);

    if (!isGroup) { // Processa apenas mensagens de chats individuais
      if (completedSessions.has(chatId)) { // Verifica se a sessão já foi concluída se foi vai ignorar obs: 
        console.log(`Sessão com ${chatId} já está concluída. Ignorando mensagem.`);
        return; // Ignora a mensagem
      }

      if (!sessionData[chatId]) {
        sessionData[chatId] = { step: 0 }; // Inicializa a sessão se não existir
      }

      const session = sessionData[chatId];
      console.log(`Etapa atual da sessão (${chatId}): ${session.step}`);

      // Controle do fluxo de atendimento baseado no passo atual da sessão
      switch (session.step) {
        case 0:
          await client.sendText(chatId, 'Olá! Me chamo Amanda, sou assistente de suporte ao cliente do setor de tecnologia da informação e terei o prazer de seguir com seu atendimento.');
          await client.sendText(chatId, 'Por favor, informe seu nome.');
          session.step = 1;
          break;
        case 1:
          session.nomeCliente = msg;
          await client.sendText(chatId, `Obrigada, ${session.nomeCliente}. Qual o nome da unidade que precisa de atendimento?`);
          session.step = 2;
          break;
        case 2:
          session.unidade = msg;
          await client.sendText(chatId, 'Ótimo! Qual é o patrimônio/número de série do equipamento?');
          session.step = 3;
          break;
        case 3:
          session.numSerie = msg;
          await client.sendText(chatId, 'Perfeito. Qual é o defeito do equipamento?');
          session.step = 4;
          break;
        case 4:
          session.defeito = msg;
          await client.sendText(chatId, 'Entendido. Em que setor o equipamento se encontra?');
          session.step = 5;
          break;
        case 5:
          session.setor = msg;
          await client.sendText(chatId, 'Qual o nome ou número de contato, e-mail do responsável pelo equipamento na unidade?');
          session.step = 6;
          break;
        case 6:
          session.contatoResponsavel = msg;
          await client.sendText(chatId, 
            `Confira os dados do seu chamado:\n\nNome: ${session.nomeCliente}\nUnidade: ${session.unidade}\nPatrimônio/Número de Série: ${session.numSerie}\nDefeito: ${session.defeito}\nSetor: ${session.setor}\nContato Responsável: ${session.contatoResponsavel}\n\nDeseja modificar algo? Responda com o número correspondente:\n1. Nome\n2. Unidade\n3. Patrimônio/Número de Série\n4. Defeito\n5. Setor\n6. Contato Responsável\n7. Tudo Ok`
          );
          session.step = 7;
          break;
        case 7:
          if (msg === '7') {
            await client.sendText(chatId, 'Agradecemos seu contato. Iremos agendar seu atendimento e logo retornaremos com o prazo para atendimento.');
            console.log('Dados do atendimento:', session);
            saveAttendance(chatId, session); // Salva os dados de atendimento em um arquivo
            delete sessionData[chatId]; // Limpa a sessão para reiniciar a conversa
            completedSessions.add(chatId); // Marca a sessão como concluída
          } else if (['1', '2', '3', '4', '5', '6'].includes(msg)) {
            session.editField = parseInt(msg);
            const fieldNames = ['Nome', 'Unidade', 'Patrimônio/Número de Série', 'Defeito', 'Setor', 'Contato Responsável'];
            await client.sendText(chatId, `Por favor, informe o novo nome do(a) ${fieldNames[session.editField - 1]}:`);
            session.step = 8;
          } else {
            await client.sendText(chatId, 'Opção inválida. Por favor, responda com um número de 1 a 7.');
          }
          break;
        case 8:
          if (!session.editField) {
            await client.sendText(chatId, 'Algo deu errado. Por favor, reinicie a conversa.');
            session.step = 0;
          } else {
            switch (session.editField) {
              case 1:
                session.nomeCliente = msg;
                break;
              case 2:
                session.unidade = msg;
                break;
              case 3:
                session.numSerie = msg;
                break;
              case 4:
                session.defeito = msg;
                break;
              case 5:
                session.setor = msg;
                break;
              case 6:
                session.contatoResponsavel = msg;
                break;
            }
            session.editField = null; // Reseta o campo de edição
            await client.sendText(chatId, `Dado atualizado. Confira os dados novamente:\n\nNome: ${session.nomeCliente}\nUnidade: ${session.unidade}\nPatrimônio/Número de Série: ${session.numSerie}\nDefeito: ${session.defeito}\nSetor: ${session.setor}\nContato Responsável: ${session.contatoResponsavel}\n\nDeseja modificar algo? Responda com o número correspondente:\n1. Nome\n2. Unidade\n3. Patrimônio/Número de Série\n4. Defeito\n5. Setor\n6. Contato Responsável\n7. Tudo Ok`);
            session.step = 7; // Permite que o usuário escolha novamente
          }
          break;
        default:
          await client.sendText(chatId, 'Algo deu errado. Por favor, reinicie a conversa.');
          session.step = 0;
          break;
      }
    }
  });
}
