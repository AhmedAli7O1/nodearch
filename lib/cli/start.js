#!/usr/bin/env node

const cliColors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

checkNodeVersion();

import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { getLoadMode } from './dist/utils/load-mode.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { register } from 'node:module';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(await fs.readFile(join(__dirname, './package.json'), 'utf8'));
process.env.NODEARCH_CLI_VERSION = pkg.version;

if (getLoadMode() === 'ts') {
  
  const swcNodePath = fileURLToPath(import.meta.resolve('@swc-node/register'));
  const swcNodeRegisterPath = path.join(path.dirname(swcNodePath), 'esm', 'esm.mjs');

  const appTsConfigPath = join(__dirname, './tsconfig.json');
  
  process.env.SWC_NODE_PROJECT = appTsConfigPath;

  register(pathToFileURL(swcNodeRegisterPath), pathToFileURL('./'));

  const appStart = join(__dirname, './dist/start.js');

  import(pathToFileURL(appStart));
}
else if (getLoadMode() === 'js') {
  import(new URL('./dist/start.js', import.meta.url));
}
else {
  print(cliColors.red, `[NodeArch] Unknown value for the option loadMode, valid values are 'ts' or 'js'`);
}

function print(color, message) {
  console.log(`${color}${message}${cliColors.reset}`);
}

function checkNodeVersion() {
  const currentVersion = process.versions.node;
  const targetVersion = "20.10.0";
  let isTargetVersion = false; 

  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);
  const [targetMajor, targetMinor, targetPatch] = targetVersion.split('.').map(Number);

  if (currentMajor > targetMajor ||
    (currentMajor === targetMajor && currentMinor > targetMinor) ||
    (currentMajor === targetMajor && currentMinor === targetMinor && currentPatch >= targetPatch)) {
    isTargetVersion = true;
  } else {
    isTargetVersion = false;
  }

  if (!isTargetVersion) {
    print(cliColors.red, `[NodeArch] Node version must be at least ${targetVersion}`);
    process.exit(1);
  }
}