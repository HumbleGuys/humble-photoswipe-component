import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";

export default ({ options = {} }) => ({
    lightbox: null,
    elements: null,

    init() {
        document.addEventListener("alpine:initialized", () => {
            this.elements = this.$el.querySelectorAll("a");
            this.initLightbox();
        });
    },

    initLightbox() {
        this.lightbox = new PhotoSwipeLightbox({
            gallery: this.$el,
            children: "a",
            pswpModule: PhotoSwipe,
            ...options,
        });

        this.lightbox.init();
    },

    open() {
        if (this.elements && this.elements[0]) {
            this.elements[0].click();
        }
    },
});
