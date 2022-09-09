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