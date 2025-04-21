<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = "product";

    public function collections()
    {

        return $this->belongsToMany(Collection::class, '_collectionstoproduct', 'B', 'A');
    }


    public function category()
    {
        return $this->belongsTo(Category::class, "categoryId");
    }



    public function variants()
    {
        return $this->hasMany(Variant::class, "productId");
    }


    public function reviews()
    {
        return $this->hasMany(Review::class, "productId");
    }

    public function avg_Rate()
    {
        return $this->reviews()->avg("rate");
    }



}
