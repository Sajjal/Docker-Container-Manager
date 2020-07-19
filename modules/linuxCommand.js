const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function linuxCommand(command) {
  try {
    const { error, stdout, stderr } = await exec(command);
    if (stderr) {
      //console.log(`stderr: ${stderr}`);
      return;
    }
    return stdout;
    //console.log(`stdout: ${stdout}`);
  } catch (e) {
    //console.log(e);
  }
}

//linuxCommand("pwd");

module.exports = { linuxCommand };
