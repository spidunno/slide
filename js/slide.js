import engine from './engine';

function callback() {
  console.log('Running');
}


var myEngine = engine.create(callback);
myEngine.start();

document.addEventListener('click', () => {
  myEngine.stop();
});
