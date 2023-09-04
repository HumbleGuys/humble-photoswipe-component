import YoutubePlayer from './youtubePlayer';

export default class VideoPlayer {
    constructor({ videoUrl, index }) {
        this.videoUrl = videoUrl;
        this.index = index;
        this.youtubePlayer = null;
        this.id = `photoSwipeVideoIframe_${this.index}`;
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

    play() {
        const interval = setInterval(() => {
            const el = document.querySelector(`#${this.id}`);

            if (el) {
                this.youtubePlayer = new YoutubePlayer(this.videoUrl, this.id);
                clearInterval(interval);
            }
        }, 100);
    }

    destroy() {
        if (this.youtubePlayer) {
            this.youtubePlayer.player.destroy();
            this.youtubePlayer = null;
        }
    }
}
