const net = require('net');

/**
 * Verifica se uma porta está disponível
 * @param {number} port - Porta a ser verificada
 * @returns {Promise<boolean>} - True se a porta estiver disponível
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Encontra uma porta disponível a partir de uma porta inicial
 * @param {number} startPort - Porta inicial para verificar
 * @param {number} maxTries - Número máximo de tentativas
 * @returns {Promise<number>} - Porta disponível
 */
async function findAvailablePort(startPort = 3000, maxTries = 10) {
  for (let i = 0; i < maxTries; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`Não foi possível encontrar uma porta disponível a partir de ${startPort}`);
}

module.exports = {
  isPortAvailable,
  findAvailablePort
};