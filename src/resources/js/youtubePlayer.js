export default class YoutubePlayer {
    constructor(videoUrl, el) {
        this.videoUrl = videoUrl;
        this.el = el;
        this.player = null;
        this.videoId = null;

        this.init();
    }

    init() {
        this.videoId = this.getVideoId(this.videoUrl);

        if (window.onYouTubeIframeAPIReady) {
            this.initPlayer();
        } else {
            this.createPlayer();
        }
    }

    createPlayer() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            this.initPlayer();
        };
    }

    initPlayer() {
        if (window.YT === undefined || !window.YT) {
            window.onYouTubeIframeAPIReady = null;

            this.createPlayer();

            return;
        }

        this.player = new window.YT.Player(this.el, {
            height: 1080,
            width: 1920,
            videoId: this.videoId,
            playerVars: {
                playsinline: 1,
            },
            events: {
                onReady: this.onPlayerReady,
            },
        });
    }

    getVideoId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

        const match = url.match(regExp);

        return match && match[7].length == 11 ? match[7] : false;
    }

    onPlayerReady(event) {
        event.target.playVideo();
    }

    stopVideo() {
        this.player.stopVideo();
    }
}
