import https from 'https';
import path from 'path';
import process from 'process';
import Module from 'module';
import child_process from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';

const builtins = Module.builtinModules;
const JS_EXTENSIONS = new Set(['.js', '.mjs']);

const baseURL = new URL('file://');
baseURL.pathname = `${process.cwd()}/`;

try {
  fs.mkdirSync('./.cache');
} catch {}

export async function resolve(
  specifier,
  parentModuleURL = baseURL,
  defaultResolve,
) {
  if (builtins.includes(specifier)) {
    return {
      url: specifier,
      format: 'builtin',
    };
  }

  const resolved = new URL(specifier, parentModuleURL);
  const url = resolved.href;

  console.log(specifier);

  if (/^https?:\/\//.test(url)) {
    return {
      url,
      format: 'dynamic',
    };
  } else if (/^\//.test(specifier) && process.env.URL_PATH) {
    // console.log('FOUND ONE!', specifier);
    // console.log('PATH', process.env.URL_PATH);
    return {
      url: `${process.env.URL_PATH}${specifier}`,
      format: 'dynamic',
    };
  } else if (
    /^\.{0,2}[/]/.test(specifier) !== true &&
    !specifier.startsWith('file:')
  ) {
    // For node_modules support:
    return defaultResolve(specifier, parentModuleURL);
  } else {
    const ext = path.extname(resolved.pathname);
    if (!JS_EXTENSIONS.has(ext)) {
      throw new Error(
        `Cannot load file with non-JavaScript file extension ${ext}.`,
      );
    }
  }

  return {
    url,
    format: 'esm',
  };
}

export async function dynamicInstantiate(url) {
  // const program = path.resolve('fetchurl.mjs');
  // const child = fork.fork(program);

  console.log('x', url);
  const response = await fetch(url);
  const body = await response.text();

  console.log(body);

  const hash = crypto
    .createHash('sha1')
    .update(url)
    .digest('hex');

  console.log(hash);

  const cacheFile = path.resolve(`.cache/${hash}.mjs`);

  fs.writeFileSync(cacheFile, body);
  fs.writeFileSync(`./.cache/${hash}-path`, url);

  // const command = `URL_PATH="${url}" node --experimental-modules --loader ./url-loader.mjs ./.cache/${cacheFile}`;

  // console.log(command);

  const process = child_process.spawnSync(
    'node',
    [
      '--experimental-modules',
      '--loader',
      path.resolve('url-loader.mjs'),
      cacheFile,
    ],
    {
      env: {
        URL_PATH: url,
      },
    },
  );

  console.log(process);

  // const x = eval(body);
  // console.log(x);

  // .then(response => console.log(response))
  // .then(body => console.log(body));

  return {
    exports: ['default'],
    execute: exports => {
      // get and set functions provided for pre-allocated export names
      exports.default.set('value');
    },
  };
}
