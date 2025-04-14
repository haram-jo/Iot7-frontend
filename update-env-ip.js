const fs = require('fs');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name of Object.keys(interfaces)) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const ip = getLocalIP();
const envPath = '.env';
let content = fs.readFileSync(envPath, 'utf8');

const updated = content.replace(
  /API_URL=http:\/\/([0-9.]+):(\d+)/,
  (_, oldIP, port) => `API_URL=http://${ip}:${port}`,
);

fs.writeFileSync(envPath, updated, 'utf8');
console.log(`✅ .env 파일의 IP가 ${ip}로 업데이트되었습니다.`);
