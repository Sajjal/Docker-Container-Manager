const fs = require("fs");
const { linuxCommand } = require("../modules/linuxCommand");

async function generateConf(data, serverName, sudoPass) {
  const partA = `<VirtualHost *:80>
  ServerName ${serverName}${"\n"}
  <Proxy balancer://mycluster>`;

  let partB = "\n";
  for (let i = 0; i < data.length; i++) {
    partB = partB + `${"\t"}${"\t"}BalancerMember http://127.0.0.1:${data[i].port}` + "\n";
  }

  const partC = `${"\t"}</Proxy>${"\n"}
  ProxyPreserveHost On
  ProxyPass / balancer://mycluster/
  ProxyPassReverse / balancer://mycluster/${"\n"}
  </VirtualHost>`;

  const info = partA + partB + partC;

  await createFile(`/etc/apache2/sites-available/${serverName}.conf`, info);
  await linuxCommand(`echo "${sudoPass}" | sudo -S a2ensite ${serverName}.conf`);
  await linuxCommand(`echo "${sudoPass}" | sudo -S service apache2 reload`);
  await linuxCommand(`echo "${sudoPass}" | sudo -S systemctl restart apache2`);
  return info;
}

async function generateConfSSL(data, serverName, sudoPass) {
  const partA = `<VirtualHost *:80>
  ServerName ${serverName}${"\n"}
  <Proxy balancer://mycluster>`;

  let partB = "\n";
  for (let i = 0; i < data.length; i++) {
    partB = partB + `${"\t"}${"\t"}BalancerMember http://127.0.0.1:${data[i].port}` + "\n";
  }

  const partC = `${"\t"}</Proxy>${"\n"}
  ProxyPreserveHost On
  ProxyPass / balancer://mycluster/
  ProxyPassReverse / balancer://mycluster/${"\n"}

  RewriteEngine on
  RewriteCond %{SERVER_NAME} =${serverName}
  RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]${"\n"}

  </VirtualHost>`;

  const info = partA + partB + partC;

  await createFile(`/etc/apache2/sites-available/${serverName}.conf`, info);
  await linuxCommand(`echo "${sudoPass}" | sudo -S a2ensite ${serverName}.conf`);
  await linuxCommand(`echo "${sudoPass}" | sudo -S service apache2 reload`);
  await linuxCommand(`echo "${sudoPass}" | sudo -S systemctl restart apache2`);
  return info;
}

async function createFile(path, content) {
  fs.writeFile(path, content, function (err) {
    if (err) return;
  });
}

module.exports = { generateConf, generateConfSSL };
