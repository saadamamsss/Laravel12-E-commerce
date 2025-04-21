<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //

    protected $table = "orders";
    protected $fillable = [
        'subTotal',
        'discount',
        'shipCost',
        'tax',
        'total',
        'status',
        'name',
        'email',
        'phone',
        'country',
        'city',
        'province',
        'address_1',
        'address_2',
        'zipCode',
        'userId',
        'paymentStatus',
        'canceledDate',
        'deliveredDate',
        'confirmedDate',
        'shippedDate',
    ];
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }
    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'orderId');
    }

    public function shipping()
    {
        return $this->hasOne(ShippingAddress::class, 'orderId');
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}























