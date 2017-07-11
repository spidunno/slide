import Slide from './slide';


window.addEventListener('load', function() {
  const element = document.querySelector('.js-content-viewport');
  const slide = new Slide(element, {
    direction: 'vertical',
    friction: .9,
    keyboard: true,
    touch: true
  });

  const horizontalElement = document.querySelector('.js-content-viewport-horizontal');
  const slideHorizontal = new Slide(horizontalElement, {
    direction: 'horizontal',
    friction: .98,
    keyboard: true,
    touch: true
  });
});
