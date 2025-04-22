<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/auth.php';



// In your web.php
Route::get('/', function () {

    $page = DB::table('pages')->where("slug", "/")->first();

    return Inertia::render("BuildPage", ["data" => json_decode($page->content)]);

})->name("home");



Route::get('/shop', [ProductController::class, "showAllShop"])->name("shop");


Route::get('/cart', [CartController::class, "Index"])->name("cart");


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, "Index"])->middleware('cart-has-items')->name('checkout');

    Route::post('/place-order', [CheckoutController::class, "placeOrder"])->name("place.order");

    Route::get('/order-confirmation/{orderID}', [CheckoutController::class, 'checkoutSuccess'])->name("checkout.success");
});


Route::get('/about-us', function () {
    return Inertia::render("About");
})->name('contact.index');

Route::get('/contact-us', [ContactController::class, "Index"])->name('contact.index');

Route::post('/send-contact-message', [ContactController::class, "sendContactMessage"])->name('contact.send');


Route::get('/{slug}', [ProductController::class, "Index"]);

Route::get('/products/{SKU}', [ProductController::class, "productDetails"])->name("product.details");


Route::prefix('/account/')->middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AccountController::class, "Index"])->name('dashboard');
    // 
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // 
    Route::get('orders', [OrderController::class, 'Index'])->name('orders.index');
    Route::get('orders/{id}', [OrderController::class, 'showOrderDetails'])->name('order.details');
    // 
    Route::get('address', [ProfileController::class, 'showAddress'])->name('address.index');
    // 
    Route::get('payments', [ProfileController::class, 'paymentMethods'])->name('address.index');
});



//======================== API group ================================================
Route::prefix('/_/api/')->group(function () {

    Route::get('shop-products/{type}/{slug}', [ProductController::class, "fetchProducts"])->name("shop.all");
    // 
    Route::get('product-collection', [ProductController::class, "getProductByCollection"])->middleware("cache.response:500");
    ;
    // 
    Route::get('find-product-withId', [ProductController::class, "findProduct"])->middleware("cache.response:500");
    ;
    // 
    Route::get('product-categories', [CategoryController::class, "getCategoriesWithProducts"])->middleware("cache.response:500");
    ;

    // 
    Route::post('add-product-to-cart', [CartController::class, "addItemToCart"]);
    Route::get('get-cart-content', [CartController::class, "getCartContent"]);
    Route::post('update-cart-item', [CartController::class, "updateCartItemQty"]);
    Route::get('clear-cart', [CartController::class, "clearCart"]);
    // 
    Route::get('remove-coupon', [CartController::class, "removeCoupon"])->middleware(["auth", "verified"]);
    Route::post('apply-coupon', [CartController::class, "applyCoupon"])->middleware(["auth", "verified"]);

    // 
    Route::get('get-orders', [OrderController::class, "getOrders"])->middleware(["auth", "verified"]);
    // 
    Route::post('set-address-default', [ProfileController::class, "setDefaultAddress"])->middleware(["auth", "verified"]);
    Route::delete('delete-address', [ProfileController::class, "deleteAddress"])->middleware(["auth", "verified"]);
    Route::post('add-new-address', [ProfileController::class, "addNewAddress"])->middleware(["auth", "verified"]);
    Route::post('update-address', [ProfileController::class, "updateAddress"])->middleware(["auth", "verified"]);

    // 
    Route::post('add-review', [ProfileController::class, "addReview"])->middleware(["auth", "verified"]);

    // 
    Route::post('notifications-read-all', [NotificationController::class, "markAllAsRead"])->middleware(["auth", "verified"])->name("notifications.read-all");
    Route::post('notifications-read-group', [NotificationController::class, "markGroupAsRead"])->middleware(["auth", "verified"])->name("notifications.read-group");

    Route::get('recommended-products', [ProductController::class, "recommendedProducts"])->middleware("cache.response:100");

});



