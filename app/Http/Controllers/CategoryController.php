<?php

namespace App\Http\Controllers;

use App\Models\Category;
use DB;
use Illuminate\Http\Request;
use function PHPUnit\Framework\returnArgument;

class CategoryController extends Controller
{
    //



    public function getCategoriesWithProducts(Request $request)
    {

        $request->validate([
            "limit" => "required|numeric",
            "categories" => "required|string"
        ]);

        $categoryIds = explode("--", $request->categories);
        $categories = Category::whereIn('id', $categoryIds)->select("id", "name", "slug")->get()->each(function ($category) {
            $category->setRelation('products', $category->products()->select("id", "name", "slug", "price", "images")->limit(10)->get());

        });
        // 
        return response()->json($categories);


    }
}
