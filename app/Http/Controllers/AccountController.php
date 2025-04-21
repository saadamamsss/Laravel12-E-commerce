<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccountController extends Controller
{
    //

    public function Index()
    {

        $recentOrders = Order::where("userId", Auth::user()->id)->whereNot("status", "delivered")->orWhereNot("status", "cancelled")->count();

        return Inertia::render('Dashboard', ['recentOrders' => $recentOrders]);

    }
}
