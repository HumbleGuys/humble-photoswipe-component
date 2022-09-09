import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';

export default ({ options = {} }) => ({
    init () {
        document.addEventListener('alpine:initialized', () => {
            this.initLightbox();
        });
    },

    initLightbox () {
        console.log(this.$el.id);

        const lightbox = new PhotoSwipeLightbox({
            gallery: this.$el,
            children: 'a',
            pswpModule: PhotoSwipe,
            ...options
        });

        lightbox.init();
    }
});