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
        <link rel="stylesheet" href="{{ asset('../vendor/humble-guys/humble-photoswipe-component/public/resources/dist/assets/index.1201b41e.css') }}">
        <script module defer src="{{ asset('../vendor/humble-guys/humble-photoswipe-component/public/resources/dist/assets/index.262348ba.js') }}"></script>
    @endpush   
@endonce 