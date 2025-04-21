<?php

use App\Http\Middleware\CartHasContent;
use App\Http\Middleware\CacheApiResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->api([
            \Illuminate\Session\Middleware\StartSession::class, 
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);


        $middleware->alias([
            'cart-has-items' => CartHasContent::class,
            'cache.response' => CacheApiResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
