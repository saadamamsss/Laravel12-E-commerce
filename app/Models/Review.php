<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    //
    protected $table = "reviews";
    protected $fillable = [
        'review',
        'rate',
        'userId',
        'productId'
    ];



    public function product()
    {
        return $this->belongsTo(Product::class, "productId");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "userId");
    }

}
