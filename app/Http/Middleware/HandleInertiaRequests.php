<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use App\Services\SharedServices;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';
    protected $sharedServices;


    public function __construct(SharedServices $sharedServices)
    {
        $this->sharedServices = $sharedServices;
    }
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function handle(Request $request, \Closure $next)
    {
        if (config('inertia.ssr.enabled')) {
            $this->version = fn() => $this->version($request);
        }

        return parent::handle($request, $next);
    }


    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,

                    'verified' => $request->user()->email_verified_at ? true : false,
                ] : null,
            ],
            "notifications" => fn() => Cache::remember('notifications', 0, function () use ($request) {
                return $request->user()?->unreadNotifications;
            }),
            "cartCount" => Cart::instance('cart')->Content()->count(),
            "headerCollection" => fn() => Cache::remember('header-collection', 3600, function () {
                return $this->sharedServices->getMenuItems("header-collection");
            }),
            "mainMenu" => fn() => Cache::remember('main-menu', 3600, function () {
                return $this->sharedServices->getMenuItems("main-menu");
            }),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

        ]);
    }

}
