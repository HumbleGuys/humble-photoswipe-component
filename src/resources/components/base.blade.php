@props([
    'options' => []
])

<div 
    x-data="photoSwipe({
        options: {{ json_encode($options) }}
    })"
    {{ $attributes }}
>
    {!! $slot !!}
</div>

@once
    @push('head')
        <link rel="stylesheet" href="{{ asset('../vendor/humble-guys/humble-photoswipe-component/public/resources/dist/style.css?v=0.0.6') }}">
        <script module defer src="{{ asset('../vendor/humble-guys/humble-photoswipe-component/public/resources/dist/humble-photoswipe-component.umd.js?v=0.0.6') }}"></script>
    @endpush   
@endonce 