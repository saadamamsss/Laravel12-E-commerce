<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Product;
use App\Models\Variant;
use Carbon\Carbon;
use DB;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    //

    public function Index()
    {



        $newCart = $this->getCartData();
        $public_products = DB::table('product')->inRandomOrder()->take(10)->get();
        return Inertia::render("Cart", ['data' => ["cart" => json_encode($newCart), "public_products" => $public_products]]);

    }



    public function addItemToCart(Request $request)
    {
        $request->validate([
            'productId' => "required|numeric",

            "quantity" => "required|numeric"
        ]);


        $product = Product::select("id", "name", "price")->findOrFail($request->productId);
        $variant = $request->variantId ? Variant::findOrFail($request->variantId) : null;

        // Use special price if available, otherwise use base price
        $price = $variant ? $variant->price : $product->price;


        Cart::instance("cart")->add([
            'id' => $product->id, // Using variant ID as cart item ID
            'name' => $product->name,
            'qty' => $request->quantity,
            'price' => $price,
            'options' => $variant ? collect($variant->makeHidden(["createdAt", "updatedAt", "productId"])->toArray())->filter()->all() : []
        ])->associate(Product::class);



        return response()->json(["count" => Cart::instance("cart")->content()->count(), "content" => Cart::instance("cart")->content()->toArray()]);

    }
    public function updateCartItemQty(Request $request)
    {

        Cart::instance('cart')->update($request->input('rowId'), $request->input('qty'));
        $newCart = $this->getCartData();
        return response()->json($newCart);

    }

    public function getCartContent()
    {


        // Cart::instance("cart")->destroy();
        $newCart = $this->getCartData();
        return response()->json($newCart);

    }

    public function clearCart()
    {

        Cart::instance('cart')->destroy();
        session()->forget('coupon');
        $newCart = $this->getCartData();
        return response()->json($newCart);

    }


    public function applyCoupon(Request $request)
    {

        $request->validate(['coupon_code' => 'required|string']);

        $coupon = Coupon::where('code', $request->coupon_code)->first();

        if (!$coupon) {
            return response()->json(['error' => 'This coupon not found!']);
        }

        $total = (float) str_replace(',', '', Cart::instance('cart')->total());
        if ($total < $coupon->minOrderValue) {
            return response()->json(['error' => 'Please, Increase your cart total value!']);
        }

        if (Carbon::create($coupon->expDate) < Carbon::now()) {
            return response()->json(['error' => 'This coupon was expired !']);
        }


        session()->put('coupon', [
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
        ]);


        $newCart = $this->getCartData();
        return response()->json(["cart" => $newCart, "msg" => "Coupon applied successfully"]);


    }

    public function removeCoupon()
    {

        session()->forget('coupon');
        $newCart = $this->getCartData();
        return response()->json($newCart);
    }


    public function getCartData()
    {
        $cartInstance = Cart::instance('cart');
        $discountTotal = $this->discountedTotal();
        $discount = $this->discountAmount();

        $subtotal = floatval(str_replace(',', '', $cartInstance->subtotal()));
        $total = floatval(str_replace(',', '', $cartInstance->total()));
        $cart = [
            'count' => $cartInstance->content()->count(),
            'content' => $cartInstance->content(),
            'subtotal' => $subtotal,
            'tax' => $cartInstance->tax(),
            'total' => $total,
            "coupon" => !!session()->has('coupon'),
            "discountedTotal" => $discountTotal,
            "discount" => $discount,
        ];
        return $cart;
    }


    public function discountedTotal()
    {
        $total = (float) str_replace(',', '', Cart::instance('cart')->total());

        if (!session()->has('coupon')) {
            return $total;
        }

        $coupon = session('coupon');

        if ($coupon['type'] === 'fixed') {
            return max($total - $coupon['value'], 0);
        }

        return $total * (1 - ($coupon['value'] / 100));
    }


    public function discountAmount()
    {
        $total = (float) str_replace(',', '', Cart::instance('cart')->total());
        if (!session()->has('coupon')) {
            return 0;
        }


        return $total - $this->discountedTotal();
    }

}
