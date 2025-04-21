<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;

class CacheApiResponse
{
    
    public function handle($request, Closure $next, $minutes = 60)
    {
        $key = 'api_'.md5($request->fullUrl());
        
        if (Cache::has($key)) {
            return response()->json(Cache::get($key));
        }
    
        $response = $next($request);
        
        if ($response->isSuccessful()) {
            return Cache::remember($key, $minutes , function() use ($response){
                return $response->getOriginalContent();
            });
        }
    
        return $response;
    }
}
