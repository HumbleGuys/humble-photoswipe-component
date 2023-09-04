import Vimeo from '@vimeo/player';

export default class VimeoPlayer {
    constructor(videoUrl, el) {
        this.videoUrl = videoUrl;
        this.el = el;
        this.player = null;

        this.init();
    }

    init() {
        this.player = new Vimeo(this.el, {
            url: this.videoUrl,
            width: 1920,
            loop: false,
            autoplay: true,
        });
    }

    destroy() {
        this.player.destroy();
    }
}
