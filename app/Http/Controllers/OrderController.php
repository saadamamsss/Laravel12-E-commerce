<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    //
    public function Index()
    {


        return Inertia::render("Order", ['orders' => $this->paginatedOrders()]);
    }

    public function getOrders()
    {
        return response()->json($this->paginatedOrders());

    }
    public function paginatedOrders()
    {

        return Order::where("userId", Auth::user()->id)->withCount("items")->paginate(10);
    }

    public function showOrderDetails($id)
    {
        $order = Order::with([
            'transaction',
            'items.product:id,name,images',
            'items.variant',
            'shipping'
        ])->findOrFail($id);

        $order->items->each(function ($item) {
            if ($item->variant) {
                $item->variant->makeHidden(['productId', 'createdAt', 'updatedAt', 'price', 'quantity']);
                $item->variant->setRawAttributes(collect($item->variant)->filter()->all());
            }
        });


        return Inertia::render("OrderDetails", ['order' => $order]);



    }
}
