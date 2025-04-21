<?php

namespace App\Providers;

use App\Events\TestEvent;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{


    protected $listen = [
        Registered::class => [

            SendEmailVerificationNotification::class,

        ],

        NewOrderEvent::class => [
            SendNewOrderNotification::class,
        ],

        TestEvent::class => [

        ],
    ];

    /**
     * Register services.
     * 
     * 
     */


    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
