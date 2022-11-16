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

    open(index = 0) {
        if (!options.dataSource) {
            this.setDataSourceFromHtml();
        }

        this.lightbox.loadAndOpen(index);
    },

    setDataSourceFromHtml() {
        this.lightbox.options.dataSource = Array.from(this.elements).map(
            (e) => {
                return {
                    src: e.href,
                    width: e.dataset.pswpWidth,
                    height: e.dataset.pswpHeight,
                };
            }
        );
    },
});
