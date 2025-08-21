const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Erro: Porta ${PORT} ainda está em uso!`);
        process.exit(1);
    }
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
});