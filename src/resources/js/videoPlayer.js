import VimeoPlayer from './vimeoPlayer';
import YoutubePlayer from './youtubePlayer';

export default class VideoPlayer {
    constructor({ videoUrl, index }) {
        this.videoUrl = videoUrl;
        this.index = index;
        this.youtubePlayer = null;
        this.vimeoPlayer = null;
        this.id = `photoSwipeVideoIframe_${this.index}`;
        this.videoType = this.getVideoType();
        this.isPlaying = false;
    }

    getVideoType() {
        if (!this.videoUrl) {
            return;
        }

        if (this.videoUrl.includes('youtu')) {
            return 'youtube';
        }

        if (this.videoUrl.includes('vimeo')) {
            return 'vimeo';
        }

        return;
    }

    play() {
        this.tryToPlay();

        if (this.isPlaying) {
            return;
        }

        const interval = setInterval(() => {
            this.tryToPlay();

            if (this.isPlaying) {
                clearInterval(interval);
            }
        }, 100);
    }

    tryToPlay() {
        const el = document.querySelector(`#${this.id}`);

        if (el) {
            if (this.videoType === 'youtube') {
                this.playYoutube();
            } else if (this.videoType === 'vimeo') {
                this.playVimeo();
            }

            this.isPlaying = true;
        }
    }

    playYoutube() {
        this.youtubePlayer = new YoutubePlayer(this.videoUrl, this.id);
    }

    playVimeo() {
        this.vimeoPlayer = new VimeoPlayer(this.videoUrl, this.id);
    }

    destroy() {
        this.isPlaying = false;

        if (this.youtubePlayer) {
            this.youtubePlayer.destroy();
            this.youtubePlayer = null;
        }

        if (this.vimeoPlayer) {
            this.vimeoPlayer.destroy();
            this.vimeoPlayer = null;
        }
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.classList = 'photoSwipe__videoItem';

        const playerHolder = document.createElement('div');
        playerHolder.classList = 'photoSwipe__videoHolder';

        const playerHolderInner = document.createElement('div');
        playerHolderInner.classList = 'photoSwipe__videoHolderInner';

        const player = document.createElement('div');
        player.classList = 'photoSwipe__video';
        player.id = this.id;

        playerHolderInner.appendChild(player);

        playerHolder.appendChild(playerHolderInner);

        wrapper.appendChild(playerHolder);

        return wrapper;
    }
}
