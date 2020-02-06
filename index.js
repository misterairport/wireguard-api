#!/usr/bin/env node
const os = require('os');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const nconf = require('nconf');
const axios = require('axios');
const ora = require('ora');
const exec = util.promisify(require('child_process').exec);
const mkdirp = util.promisify(require('mkdirp'));
const nconf_save = util.promisify(require('nconf').save);
const fs_access = util.promisify(fs.access);

const WG_CONFIG_PATH = '/etc/wireguard';

const checkPathAndPermission = async() => {
  await exec('sudo wg');
  await(mkdirp(WG_CONFIG_PATH));
}

const loadConfigurations = async() => {
  // Load original wg configuration if exists

  nconf.env().file({ file: `./config.json` });
  const ipv4 = await axios.get(nconf.get('server.ipv4.checkOnlineHost'));
  const ipv6 = await axios.get(nconf.get('server.ipv6.checkOnlineHost'));
  nconf.set('server.ipv4', ipv4.data.split('\n')[0]);
  nconf.set('server.ipv6', ipv6.data.split('\n')[0]);
  await saveConfigurations();
}

const saveConfigurations = async() => {
  const spinner = ora('Saving configuration...').start();
  console.log('Saving configuration for you...');
  const err = await nconf_save();
  spinner.stop();
}

const setupKeys = async() => {
  try {
    console.log('✔️  Loading the kernel module')
    await exec('sudo modprobe wireguard');
    const { stdout, stderr } = await exec('lsmod | grep wireguard');
    try {
      await fs_access(`${WG_CONFIG_PATH}/privatekey`, fs.constants.F_OK);
      console.log('✔️  Private key exists')
    } catch(privateKeyExistsErr) {
      console.log('Generating private key...');
      await exec(`wg genkey | sudo tee ${WG_CONFIG_PATH}/privatekey`);
      console.log('✔️  Done');
    }
    try {
      await fs_access(`${WG_CONFIG_PATH}/publickey`, fs.constants.F_OK);
      console.log('✔️  Public key exists')
    } catch(privateKeyExistsErr) {
      console.log('Generating public key...');
      await exec(`wg pubkey < ${WG_CONFIG_PATH}/privatekey | sudo tee ${WG_CONFIG_PATH}/publickey`);
      console.log('✔️  Done');
    }
  } catch(err) {
    console.error(err);
  }
}

const setupNetwork = async() => {
  const interfaces = os.networkInterfaces();
  for(let itfname in interfaces) {
    console.log(itfname);
  }
}

const setup = async () => {
  await checkPathAndPermission();
  await loadConfigurations();
  await setupKeys();
  await setupNetwork();
}

// setup();
if (process.argv.length !== 3 || ['setup','run'].indexOf(process.argv[2]) == -1) {
  console.log(chalk.dim('---\nError:') + chalk.bold(' Command not found.') + chalk.dim('\nPlease run one of the following commands:\n') +
    chalk.dim('---\n') +
    '1. wireguard-api setup\n' +
    '2. wireguard-api run\n' +
    chalk.dim('---\n') +
    chalk.dim('For more information, please visit https://github.com/sailsvpn/wireguard-api\n') +
    chalk.dim('---')
  )
} else if(process.argv[2] == 'setup') {
  setup()
}