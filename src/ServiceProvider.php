<?php

namespace HumblePhotoSwipeComponent;

use Illuminate\Support\ServiceProvider as SupportServiceProvider;

class ServiceProvider extends SupportServiceProvider
{
    public function register(): void
    {
        $this->loadViewsFrom(__DIR__.'/resources', 'photoSwipe');
    }

    public function boot(): void
    {
    }
}
