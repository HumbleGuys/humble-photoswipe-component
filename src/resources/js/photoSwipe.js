import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import YoutubePlayer from './youtubePlayer';

export default ({ options = {} }) => ({
    lightbox: null,
    elements: null,
    youtubePlayers: [],

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

                const videoUrl = content.data.src;

                const wrapper = document.createElement('div');
                wrapper.classList = 'photoSwipe__videoItem';

                const playerHolder = document.createElement('div');
                playerHolder.classList = 'photoSwipe__videoHolder';

                const playerHolderInner = document.createElement('div');
                playerHolderInner.classList = 'photoSwipe__videoHolderInner';

                const player = document.createElement('div');
                player.classList = 'photoSwipe__video';
                player.id = `videoModalYoutube_${content.index}`;

                playerHolderInner.appendChild(player);

                playerHolder.appendChild(playerHolderInner);

                wrapper.appendChild(playerHolder);

                content.element = wrapper;
            }
        });

        this.lightbox.on('contentActivate', ({ content }) => {
            if (content.type === 'video') {
                const id = `videoModalYoutube_${content.index}`;

                const videoUrl = content.data.src;

                const interval = setInterval(() => {
                    const el = document.querySelector(`#${id}`);
                    if (el) {
                        this.youtubePlayers.push({
                            id: id,
                            instance: new YoutubePlayer(videoUrl, id),
                        });

                        clearInterval(interval);
                    }
                }, 100);
            }
        });

        this.lightbox.on('contentDeactivate', ({ content }) => {
            if (content.type === 'video') {
                const id = `videoModalYoutube_${content.index}`;

                const player = this.youtubePlayers.find((player) => player.id === id);

                if (player) {
                    player.instance.player.destroy();

                    this.youtubePlayers.splice(this.youtubePlayers.indexOf(player), 1);
                }
            }
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
        this.lightbox.options.dataSource = Array.from(this.elements).map((e) => {
            return {
                src: e.href,
                width: e.dataset.pswpWidth,
                height: e.dataset.pswpHeight,
            };
        });
    },
});
