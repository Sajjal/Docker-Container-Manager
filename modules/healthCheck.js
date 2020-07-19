const { linuxCommand } = require("./linuxCommand");

async function healthCheck(port) {
  const command = `curl -s localhost:${port} >/dev/null && echo Healthy || echo Dead`;
  let result = await linuxCommand(command);
  result = result.trim();
  const data = { status: result, port: port };
  return data;
}

module.exports = { healthCheck };
