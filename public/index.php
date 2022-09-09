<?php

use HumbleCore\App\Application;
use HumbleCore\View\ViewServiceProvider;
use HumblePhotoSwipeComponent\ServiceProvider;

error_reporting(E_ALL);

require_once dirname(__DIR__).'/vendor/autoload.php';

$_ENV['APP_DEBUG'] = 'true';
$_ENV['APP_ENV'] = 'local';

$app = new Application(dirname(__DIR__), dirname(__DIR__).'/public');

$app->setResourcePath(dirname(__DIR__).'/public/resources');

config([
    'app' => [
        'providers' => [
            ViewServiceProvider::class,

            ServiceProvider::class,
        ],
    ],

    'view' => [
        'paths' => [
            resourcePath(),
        ],

        'compiled' => storagePath('cache'),
    ],
]);

$app->init();

$app->boot();

echo view('views.example');
