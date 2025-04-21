<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    //

    protected $table = "transaction";
    protected $fillable = [
        'status',
        'method',
        'amount',
        'userId',
        'orderId'
    ];


    public function order()
    {
        return $this->belongsTo(Order::class, "orderId");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "userId");
    }

}






