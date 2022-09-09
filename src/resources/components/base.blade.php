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
        <link rel="stylesheet" href="{{ asset('../vendor/humble-guys/humble-photoswipe-component/public/resources/dist/assets/style.css?v=0.0.2') }}">
        <script module defer src="{{ asset('../vendor/humble-guys/humble-photoswipe-component/public/resources/dist/assets/humble-photoswipe-component.umd.js?v=0.0.2') }}"></script>
    @endpush   
@endonce 