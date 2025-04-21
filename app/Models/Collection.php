<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    protected $table = "collections";

    public function products()
    {
        return $this->belongsToMany(Product::class, '_collectionstoproduct', 'A', 'B');
    }
}
