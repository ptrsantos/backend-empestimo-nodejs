const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;

function clearPort() {
    const command = `powershell -Command "Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"`;
    
    exec(command, (error) => {
        if (error) {
            // Ignore errors - port might not be in use
            process.exit(0);
        }
        process.exit(0);
    });
}

clearPort();
