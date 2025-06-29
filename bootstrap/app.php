<?php

use App\Http\Middleware\CartHasContent;
use App\Http\Middleware\CacheApiResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
        $exceptions->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Not found.'
                ], 404);
            }

            return Inertia::render('NotFound', [
                'status' => 404,
                'title' => 'Page Not Found',
                'message' => 'The page you requested does not exist.'
            ])->toResponse($request)->setStatusCode(404);
        });

        $exceptions->renderable(function (ModelNotFoundException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Resource not found.'
                ], 404);
            }

            return Inertia::render('NotFound', [
                'status' => 404,
                'title' => 'Resource Not Found',
                'message' => 'The resource you requested does not exist.'
            ])->toResponse($request)->setStatusCode(404);
        });
    })
    ->create();