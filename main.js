import React from 'https://dev.jspm.io/react';
import ReactDOM from 'https://dev.jspm.io/react-dom';
import double from './double.js';

ReactDOM.render(
  React.createElement('p', {}, `Hello World ${double(2)}`),
  document.getElementById('root'),
);
