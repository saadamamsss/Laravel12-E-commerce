<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\SharedServices;

class ProductController extends Controller
{
    protected $filters;
    protected $sharedServices;

    // Selected fields for product listings to reduce memory usage
    protected const PRODUCT_LIST_FIELDS = [
        'id',
        'name',
        'slug',
        'images',
        'SKU',
        'price'
    ];

    public function __construct(Request $request, SharedServices $sharedServices)
    {
        $this->filters = $request;
        $this->sharedServices = $sharedServices;
    }

    /**
     * Route handler for different page types
     */
    public function index($slug)
    {
        $page = DB::table('pages')
            ->where("slug", $slug)
            ->select("type", "content")
            ->firstOrFail();

        return match ($page->type) {
            'category' => $this->showCategoryShop($slug),
            'brand' => $this->showBrandShop(),
            'collection' => $this->showCollectionShop(),
            'build' => $this->showBuildPage($page->content),
            default => abort(404)
        };
    }

    /**
     * Shop view methods with more descriptive names
     */
    protected function showCategoryShop(string $slug)
    {
        return Inertia::render('Shop', [
            'brands' => $this->sharedServices->getBrands(),
            'categories' => $this->sharedServices->getCategoryChilds($slug),
            'pageType' => 'category'
        ]);
    }

    protected function showBrandShop()
    {
        return Inertia::render('Shop', [
            'categories' => $this->sharedServices->getCategories(),
            'pageType' => 'brand'
        ]);
    }

    protected function showCollectionShop()
    {
        return Inertia::render('Shop', [
            'brands' => $this->sharedServices->getBrands(),
            'categories' => $this->sharedServices->getCategories(),
            'pageType' => 'collection'
        ]);
    }
    public function showAllShop()
    {
        return Inertia::render('Shop', [
            'brands' => $this->sharedServices->getBrands(),
            'categories' => $this->sharedServices->getCategories(),
            'pageType' => 'all'
        ]);
    }

    protected function showBuildPage($content)
    {
        return Inertia::render('BuildPage', [
            'data' => json_decode($content, true)
        ]);
    }

    /**
     * Fetch products based on type
     */
    public function fetchProducts($type, $slug)
    {
        $data = match ($type) {
            "all" => $this->getAllProducts(),
            "category" => $this->getProductsByCategory($slug),
            "brand" => $this->getProductsByBrand($slug),
            "collection" => $this->getProductsByCollectionSlug($slug),
            default => []
        };

        return response()->json($data);
    }

    /**
     * Product retrieval methods
     */
    protected function getAllProducts()
    {
        $query = Product::query();

        if ($this->filters->has('search')) {
            $searchTerm = $this->filters->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('slug', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        return $this->getFilteredProducts($query);
    }

    protected function getProductsByCategory(string $slug)
    {
        $results = DB::select("CALL GetCategoryTree(?)", [$slug]);
        $categoryIds = collect($results)->pluck('id')->all();

        return $this->getFilteredProducts(
            Product::whereIn("categoryId", $categoryIds)
        );
    }

    protected function getProductsByBrand(string $slug)
    {
        $brandId = DB::table("brand")
            ->where("slug", $slug)
            ->value('id');

        return $this->getFilteredProducts(
            Product::where("brandId", $brandId)
        );
    }

    protected function getProductsByCollectionSlug(string $slug)
    {
        $collection = Collection::where("slug", $slug)->firstOrFail();

        $query = match ($collection->type) {
            'manual' => $collection->products(),
            'smart' => $this->applySmartCollectionConditions(
                Product::query(),
                json_decode($collection->conditions, true)
            )
        };

        return $this->getFilteredProducts($query);
    }

    /**
     * Shared product filtering logic
     */
    protected function getFilteredProducts($query)
    {
        
        return $this->applyFilters($query)
            ->select(self::PRODUCT_LIST_FIELDS)
            ->paginate(15);
    }

    protected function applyFilters($query)
    {
        // Color filter
        if ($this->filters->has('color')) {
            $colors = explode('--', $this->filters->color);
            $query->whereHas('variants', fn($q) => $q->whereIn('color', $colors));
        }

        // Size filter
        if ($this->filters->has('size')) {
            $sizes = explode('--', $this->filters->size);
            $query->whereHas('variants', fn($q) => $q->whereIn('size', $sizes));
        }

        // Brand filter
        if ($this->filters->has('brand')) {
            $brandSlugs = explode('--', $this->filters->brand);
            $brandIds = DB::table('brand')
                ->whereIn('slug', $brandSlugs)
                ->pluck('id');
            $query->whereIn('brandId', $brandIds);
        }

        // Price range filter
        if ($this->filters->has('price')) {
            [$min, $max] = array_map('intval', explode("--", $this->filters->price));
            $query->whereBetween('price', [$min, $max]);
        }

        return $query;
    }

    /**
     * Collection products retrieval
     */
    public function getProductByCollection(Request $request)
    {
        $request->validate(["collectionID" => "required|integer"]);

        $collection = Collection::findOrFail($request->collectionID);

        $products = match ($collection->type) {
            'manual' => $collection->products()->select(self::PRODUCT_LIST_FIELDS)->get(),
            'smart' => $this->applySmartCollectionConditions(
                Product::query(),
                json_decode($collection->conditions, true)
            )->select(self::PRODUCT_LIST_FIELDS)->get(),
            default => collect()
        };

        return response()->json($products);
    }

    /**
     * Smart collection condition handler
     */
    protected function applySmartCollectionConditions($query, array $conditions)
    {
        foreach ($conditions as $field => $rules) {
            foreach ($rules as $operator => $value) {
                match ($operator) {
                    'in' => $query->whereIn($field, $value),
                    'notIn' => $query->whereNotIn($field, $value),
                    'gt' => $query->where($field, '>', $value),
                    'lt' => $query->where($field, '<', $value),
                    'eq' => $query->where($field, '=', $value),
                    default => null
                };
            }
        }

        return $query;
    }

    /**
     * Single product retrieval methods
     */
    public function findProduct(Request $request)
    {
        $product = Product::with('variants')
            ->select(["id", "name", "slug", "price", "SKU", "quantity", "images", "variantType"])
            ->findOrFail($request->input("id"));
        
        $product->variants->makeHidden(['productId', 'createdAt', 'updatedAt']);
        $product->variants->each(function ($variant) {
            $variant->setRawAttributes(collect($variant)->filter()->all()); 
        });


        return response()->json($product);
    }

    public function productDetails($slug)
    {
        $product = Product::with([
            'variants',
            'reviews:id,productId,userId,rate,review',
            'reviews.user:id,name'
        ])
            ->withAvg('reviews as avg_rate', 'rate')
            ->where('slug', $slug)
            ->firstOrFail();

            $product->variants->makeHidden(['productId', 'createdAt', 'updatedAt']);
            $product->variants->each(function ($variant) {
                $variant->setRawAttributes(collect($variant)->filter()->all()); 
            });


        return Inertia::render("ProductDetails", ['product' => $product]);
    }



    public function recommendedProducts(){
        $recommendedProducts = Product::inRandomOrder()->take(5)->select("id", "name", "price", "images", "slug", 'categoryId')->with([
            "category" => function ($q) {
                $q->select('id', 'name', "slug")->get();
            }
        ])->get();

        return response()->json($recommendedProducts);


    }
}