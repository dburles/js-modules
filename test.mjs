import path from 'path';
import child_process from 'child_process';

const cacheFile =
  '/Users/dave/Projects/newjs/.cache/19860d94fcf13bfbf79b244564dab9916f664644.mjs';

const url = 'https://dev.jspm.io/react-dom';

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
