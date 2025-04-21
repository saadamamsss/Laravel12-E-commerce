<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class UserAddress extends Model
{
    //
    
    protected $table = "address";
    
    public function user(){
        return $this->belongsTo(User::class , "userId");
    }

    public function is_default(){
        return $this->id == Auth::user()->default_address_id;
    }
}
