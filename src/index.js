import './styles/style.css';
import { createGrid } from './scripts/create-grid';

const start = document.querySelector('.start-btn');
const restart = document.querySelector('.restart');
const how = document.querySelector('.how');
const tips = document.querySelector('.tips');

let timer;

['click', 'mouseover'].forEach((evt) =>
  how.addEventListener(evt, () => {
    tips.classList.add('fade-in');
    tips.classList.remove('fade-out');
    tips.classList.remove('hidden');
    clearInterval(timer);
  })
);

how.addEventListener('mouseout', () => {
  tips.classList.remove('fade-in');
  tips.classList.add('fade-out');
  timer = setTimeout(() => {
    tips.classList.add('hidden');
  }, 500);
});

tips.addEventListener('click', (e) => {
  setTimeout(() => {
    tips.classList.add('hidden');
  }, 500);
  tips.classList.remove('fade-in');
  tips.classList.add('fade-out');
});

start.addEventListener('click', (e) => {
  const nav = document.querySelector('nav');
  const main = document.querySelector('.main');
  nav.classList.add('fade-out');
  main.classList.add('fade-out');
  setTimeout(() => {
    nav.classList.add('hidden');
    main.classList.add('hidden');
  }, 500);
  setTimeout(() => {
    createGrid();
    document.querySelector('canvas').classList.add('fade-in');
  }, 550);
});

restart.addEventListener('click', (e) => {
  e.preventDefault();
  const canvas = document.querySelector('canvas');
  const alert = document.querySelector('.alert');
  canvas.classList.add('fade-out');
  alert.classList.add('fade-out');
  setTimeout(() => {
    document.body.removeChild(canvas);
    alert.classList.remove('fade-out');
    alert.classList.add('hidden');
    createGrid();
    document.querySelector('canvas').classList.add('fade-in');
  }, 550);
});
