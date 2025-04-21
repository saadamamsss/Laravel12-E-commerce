<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ShippingAddress extends Model
{

    protected $table = "shipping";


    public function order()
    {
        return $this->belongsTo(Order::class, "orderId");
    }

}
