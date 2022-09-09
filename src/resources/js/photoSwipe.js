import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';

export default ({ options = {} }) => ({
    init () {
        document.addEventListener('alpine:initialized', () => {
            this.initLightbox();
        });
    },

    initLightbox () {
        const lightbox = new PhotoSwipeLightbox({
            gallery: this.$el,
            children: 'a',
            pswpModule: PhotoSwipe,
            ...options
        });

        lightbox.init();
    }
});