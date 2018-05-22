// import fetch from './node_modules/node-fetch/lib/index.js';
import https from 'https';

console.log('dkjashdfkjashfds', https);

// fetch(url)
//   .then(response => console.log(response))
//   .then(body => console.log(body));


https.get('https://encrypted.google.com/', res => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
}).on('error', (e) => {
  console.error(e);
});