import predictNextRandom from '../dist/index.js';

predictNextRandom().then(result => {
    console.log(Math.random(), result);
}).catch(err => {
    console.error('Error:', err);
});