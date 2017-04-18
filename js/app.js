import Slide from './slide';


window.addEventListener('load', function() {
  const element = document.querySelector('.js-content-viewport');
  const slide = new Slide(element, {
    direction: 'vertical'
  });
});
