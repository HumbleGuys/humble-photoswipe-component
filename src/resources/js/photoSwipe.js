import PhotoSwipeLightbox from 'photoswipe/lightbox';

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
            pswpModule: () => import('photoswipe'),
            ...options
        });

        lightbox.init();
    }
});