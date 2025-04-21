<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = "menu";

    public function menuitems()
    {
        return $this->hasMany(MenuItems::class, "menuId");
    }
}
