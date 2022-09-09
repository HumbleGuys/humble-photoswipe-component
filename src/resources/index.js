import 'photoswipe/style.css';
import './css/index.css';

import photoSwipe from './js/photoSwipe';

document.addEventListener('alpine:init', () => {
    window.Alpine.data('photoSwipe', photoSwipe);
})

