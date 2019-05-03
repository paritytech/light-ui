// curl https://getsubstrate.io -sSf | bash

const { chmod, copyFile, existsSync, writeFileSync } = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const semver = require('semver');

const {
    substrate: { version: versionRequirement }
} = require('../packages/electron-app/package.json');
const HOME_DIR = os.homedir();
const ENDPOINT = 'https://getsubstrate.io';

const exec = promisify(require('child_process').exec);
const fsChmod = promisify(chmod);
const fsCopyFile = promisify(copyFile);
var spawn = require('child_process').spawn;

const STATIC_DIRECTORY = path.join(
    '..',
    'packages',
    'electron-app',
    'static'
);

const foundPath = [
    path.join(STATIC_DIRECTORY, 'substrate'),
    path.join(STATIC_DIRECTORY, 'substrate.exe')
].find(existsSync);

let PATH_TO_SUBSTRATE = `${HOME_DIR}/.cargo/bin/substrate`;

if (foundPath) {
    // Bundled Parity Substrate was found, we check if the version matches the minimum requirements
    getBinaryVersion(foundPath)
        .then(version => {
            console.log('Substrate version -> ', version);

            if (!version) {
                console.log("Couldn't get bundled Parity Substrate version.");
                return downloadSubstrate();
            }

            if (!semver.satisfies(version, versionRequirement)) {
                console.log(
                    'Bundled Parity Substrate %s is older than required version %s',
                    version,
                    versionRequirement
                );
                return downloadSubstrate();
            } else {
                console.log(
                    'Bundled Parity Substrate %s matches required version %s',
                    version,
                    versionRequirement
                );
            }
        })
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
} else {
    // Bundled Parity wasn't found, we download the latest version
    getBinaryVersion(PATH_TO_SUBSTRATE)
        .then(version => console.log(version))
        .catch(err => console.log(err));
    downloadSubstrate();
}

// Essentially runs this: https://github.com/paritytech/substrate#on-mac-and-ubuntu step by step.
// Only for OSX and Linux
function downloadSubstrate() {
    fetch(ENDPOINT)
        .then(r => r.text())
        .then(script => {
            writeFileSync('./scripts/getSubstrate.sh', script);
            // spawn a child process to run the script
            const getSubstrate = spawn('sh', ['getSubstrate.sh', '--', '--fast'], {
                cwd: './scripts'
            });
            // handle events as they come up
            getSubstrate.stdout.on('data', data => console.log(data.toString()))
            getSubstrate.stderr.on('data', error => console.log(error.toString()))
            getSubstrate.on('exit', code => (console.log('process exited with code -> ', code.toString())))

            const destinationPath = path.join(STATIC_DIRECTORY, 'substrate');

            return fsCopyFile(PATH_TO_SUBSTRATE, destinationPath)
                .then(() => fsChmod(destinationPath, 0o755))
                .then(() => destinationPath);
        })
        .catch(e => console.log('error happened =>', e))
}

function getBinaryVersion(binaryPath) {
    return exec(`${binaryPath} --version`)
        .then(({ stdout, stderr }) => {
            if (stderr) throw new Error(stderr);
            return stdout.match(/\d+\.\d+\.\d+/)[0];
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
