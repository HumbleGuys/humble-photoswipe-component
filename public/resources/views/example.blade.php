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
            <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg" alt="" />
        </a>

        <a 
            href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-2500.jpg" 
            data-pswp-width="1875" 
            data-pswp-height="2500" 
            data-cropped="true" 
            target="_blank"
        >
            <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-200.jpg" alt="" />
        </a>
    </x-photoSwipe::base>
</x-layout>