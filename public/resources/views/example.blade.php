<x-layout>
    <x-photoSwipe::base :options="[
        'bgOpacity' => 0.5,
    ]">
        <a
            href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg"
            data-pswp-width="1669"
            data-pswp-height="2500"
            target="_blank"
        >
            <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg" />
        </a>

        <a
            href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-2500.jpg"
            data-pswp-width="1875"
            data-pswp-height="2500"
            data-cropped="true"
            target="_blank"
        >
            <img
                src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-200.jpg"
                alt=""
            />
        </a>

        <a
            href="https://www.youtube.com/watch?v=MiVZQO1vNgs"
            data-pswp-type="video"
            target="_blank"
        >
            <img
                src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-200.jpg"
                alt=""
            />
        </a>

        <a
            href="https://www.youtube.com/watch?v=Mkx3e_HK7N4"
            data-pswp-type="video"
            target="_blank"
        >
            <img
                src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/5/img-200.jpg"
                alt=""
            />
        </a>

        <div>
            <button @click="open()">
                Open
            </button>
        </div>
    </x-photoSwipe::base>

    <hr>

    <x-photoSwipe::base :options="[
        'bgOpacity' => 0.5,
        'dataSource' => [
            [
                'src' => 'https://source.unsplash.com/Volo9FYUAzU/1620x1080',
                'width' => 1620,
                'height' => 1080,
                'alt' => 'test image 1',
            ],
            [
                'src' => 'https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg',
                'width' => 1669,
                'height' => 2500,
                'alt' => 'test image 2',
            ],
        ],
    ]">
        <div>
            <button @click="open()">
                Open without html markup
            </button>
        </div>
    </x-photoSwipe::base>

    <hr>

    <x-photoSwipe::base :options="[
        'bgOpacity' => 0.5,
        'dataSource' => [
            [
                'src' => 'https://source.unsplash.com/Volo9FYUAzU/1620x1080',
                'width' => 1620,
                'height' => 1080,
                'alt' => 'test image 1',
            ],
            [
                'src' => 'https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg',
                'width' => 1669,
                'height' => 2500,
                'alt' => 'test image 2',
            ],
            [
                'src' => 'https://source.unsplash.com/Volo9FYUAzU/1620x1080',
                'width' => 1620,
                'height' => 1080,
                'alt' => 'test image 1',
            ],
        ],
    ]">
        <div>
            <button @click="open(1)">
                Open without html markup withSpecific index
            </button>
        </div>
    </x-photoSwipe::base>
</x-layout>
