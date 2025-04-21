<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    //

    protected $table = "orderitems";
    protected $fillable = [
        'orderId',
        'productId',
        'variantId',
        'qty',
        'price'
    ];
    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class, 'variantId');
    }

}






