import {
  html,
  render,
} from 'https://unpkg.com/lit-html/lib/lit-extended.js?module';
import double from './double.js';

let count = 0;

const increment = () => {
  count += 1;
  update();
};

const Button = html`
  <button on-click=${event => increment()}>Increment</button>
`;

const App = () => html`
  <div>
    <p>The current count is ${count} doubled it's ${double(count)}</p>
    <p>${Button}</p>
  </div>
`;

const update = () => render(App(), document.getElementById('root'));

update();
