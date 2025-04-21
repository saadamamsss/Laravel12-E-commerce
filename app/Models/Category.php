<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //

    protected $table = "category";


    public function products()
    {
        return $this->hasMany(Product::class, "categoryId");
    }
    public function parent()
    {
        return $this->belongsTo(Category::class, "parentId");
    }

    public function child()
    {
        return $this->hasMany(Category::class, "parentId");
    }

}
