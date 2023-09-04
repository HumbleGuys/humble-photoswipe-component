import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import VideoPlayer from './videoPlayer';

export default ({ options = {} }) => ({
    lightbox: null,
    elements: null,
    videoPlayers: [],

    init() {
        document.addEventListener('alpine:initialized', () => {
            this.elements = this.$el.querySelectorAll('a');
            this.initLightbox();
        });
    },

    initLightbox() {
        this.lightbox = new PhotoSwipeLightbox({
            gallery: this.$el,
            children: 'a',
            pswpModule: PhotoSwipe,
            ...options,
        });

        this.lightbox.on('contentLoad', (e) => {
            const { content } = e;

            if (content.type === 'video') {
                e.preventDefault();

                const videoPlayer = new VideoPlayer({
                    videoUrl: content.data.src,
                    index: content.index,
                });

                content.element = videoPlayer.render();

                this.videoPlayers.push(videoPlayer);
            }
        });

        this.lightbox.on('contentActivate', ({ content }) => {
            if (content.type === 'video') {
                this.getCurrentVideoPlayer(content.index, content.data.src).play();
            }
        });

        this.lightbox.on('contentDeactivate', ({ content }) => {
            if (content.type === 'video') {
                this.getCurrentVideoPlayer(content.index, content.data.src).destroy();
            }
        });

        this.lightbox.on('destroy', () => {
            this.videoPlayers.forEach((player) => player.destroy());

            this.videoPlayers = [];
        });

        this.lightbox.init();
    },

    getCurrentVideoPlayer(index, videoUrl) {
        return this.videoPlayers.find((player) => player.index === index && player.videoUrl === videoUrl);
    },

    open(index = 0) {
        if (!options.dataSource) {
            this.setDataSourceFromHtml();
        }

        this.lightbox.loadAndOpen(index);
    },

    setDataSourceFromHtml() {
        this.lightbox.options.dataSource = Array.from(this.elements).map((e) => {
            return {
                src: e.href,
                width: e.dataset.pswpWidth,
                height: e.dataset.pswpHeight,
            };
        });
    },
});
