<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItems extends Model
{
    //
protected $table = "menuitem";
public function menu(){
    return $this->belongsTo(Menu::class , "menuId");
}
}
