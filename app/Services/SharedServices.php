<?php

namespace App\Services;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Notification;
use Auth;
use DB;
use Inertia\Inertia;


class SharedServices
{
    public function getBrands()
    {
        return DB::table("brand")->select("id", "slug", "name")->get();
    }

    public function getCategories()
    {
        return DB::table('category')->get();
    }

    public function getMenuItems($slug)
    {
        $menu = Menu::where("slug", $slug)->firstOrFail();
        return $menu->menuitems()->orderBy('order')->get();
    }

    public function getNotifications(){

        Notification::where("userId" , Auth::user()->id)->where("read")->get();
    }

    public function getCategoryChilds($slug)
    {
        return Category::whereHas('parent', function ($query) use ($slug) {
            $query->where('slug', $slug);
        })->get();
    }

}