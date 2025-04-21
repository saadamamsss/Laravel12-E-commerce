<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingAddress;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\OrderNotification;
use Auth;
use DB;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mail;

class CheckoutController extends Controller
{
    //
    protected $CartController;

    public function __construct()
    {
        $this->CartController = new CartController();
    }

    public function Index()
    {

        return Inertia::render('Checkout', ['total' => Cart::instance('cart')->total()]);

    }
    public function placeOrder(Request $request)
    {

        $validated = $request->validate([
            'billing_name' => 'required|string|max:255',
            'billing_email' => 'required|string|max:255',
            'billing_phone' => 'required|numeric',
            'billing_country' => 'required|string|max:255',
            'billing_city' => 'required|string|max:255',
            'billing_province' => 'required|string|max:255',
            'billing_address_1' => 'required|string|max:255',
            'billing_address_2' => 'required|string|max:255',
            'billing_zipCode' => 'required|numeric',
            'paymentMethod' => 'required|string|in:visa,paypal,cod',
            'diff_address' => 'boolean',
            'shipping_name' => 'nullable|string|max:255',
            'shipping_email' => 'nullable|string|max:255',
            'shipping_phone' => 'nullable|string|max:255',
            'shipping_country' => 'nullable|string|max:255',
            'shipping_city' => 'nullable|string|max:255',
            'shipping_province' => 'nullable|string|max:255',
            'shipping_address_1' => 'nullable|string|max:255',
            'shipping_address_2' => 'nullable|string|max:255',
            'shipping_zipCode' => 'nullable|string|max:255',
            'card_numbr' => 'nullable|string|max:255',
            'card_expDate' => 'nullable|string|max:255',
            'card_cvc' => 'nullable|string|max:255',
        ]);

        try {
            $response =  DB::transaction(function () use ($validated) {

                $order = $this->CreateOrder(($validated));

                if ($validated['diff_address'] === true) {
                    $this->storeShippingAddress($validated, $order['id']);
                }

                $this->addOrderItems($order);

                $this->processPayment($order, $validated['paymentMethod']);

                $this->sendorderconfirmation($order);

                $this->CartController->clearCart();

                return to_route('checkout.success', parameters: $order['id'])
                    ->with(key: 'success', value: 'Your order has been placed successfully!');

            });

            return $response;
        } catch (\Throwable $th) {
            //throw $th;
            return back()->with('error' , 'somthig went wrong!');
        }
        

    }

    public function CreateOrder(array $data)
    {


        $cart = $this->CartController->getCartData();

        return Order::create([
            'userId' => Auth::user()->id,
            'subTotal' => $cart['subtotal'],
            'discount' => $cart['discount'],
            'tax' => $cart['tax'],
            'total' => $cart['discountedTotal'],
            'status' => 'pending',
            'name' => $data['billing_name'],
            'email' => $data['billing_email'],
            'phone' => $data['billing_phone'],
            'country' => $data['billing_country'],
            'city' => $data['billing_city'],
            'province' => $data['billing_province'],
            'address_1' => $data['billing_address_1'],
            'address_2' => $data['billing_address_2'],
            'zipCode' => $data['billing_zipCode'],
        ]);

    }

    protected function storeShippingAddress($data, $orderId)
    {

        ShippingAddress::create([
            'name' => $data['shipping_name'],
            'email' => $data['shipping_email'],
            'phone' => $data['shipping_phone'],
            'country' => $data['shipping_country'],
            'city' => $data['shipping_city'],
            'province' => $data['shipping_province'],
            'address_1' => $data['shipping_address_1'],
            'address_2' => $data['shipping_address_2'],
            'zipCode' => $data['shipping_zipCode'],
            'orderId' => $orderId
        ]);

    }


    protected function processPayment(Order $order, string $method): void
    {
        // In a real application, you would integrate with a payment gateway here
        // This is a simplified example

        if ($method === 'cod') {

            $order->update(['paymentStatus' => 'pending']);

        } else {
            // For other payment methods, you would typically:
            // 1. Create a payment intent with the gateway
            // 2. Store the transaction details
            // 3. Update the order status

            // Example transaction record
            Transaction::create([
                'orderId' => $order->id,
                'userId' => Auth::user()->id,
                'amount' => $order->total,
                'method' => $method,
                'status' => 'pending'
            ]);

            $order->update(['paymentStatus' => 'processing']);
        }
    }



    protected function addOrderItems(Order $order): void
    {

        $cartItems = Cart::instance('cart')->content()->toArray();
        foreach ($cartItems as $item) {
            OrderItem::create([
                'orderId' => $order->id,
                'productId' => $item['id'],
                'variantId' => $item['options']['id'] ?? null,
                'qty' => $item['qty'],
                'price' => $item['price']
            ]);
        }
    }

    public function sendorderconfirmation($order)
    {

        Mail::to($order->email)->queue(new OrderConfirmation($order, $order->items));

        $admins = User::where("role", "ADM")->get();

        foreach ($admins as $admin) {

            $admin->notify(new OrderNotification($order, "New Order #" . $order['id'] . " recieved."));
        }



    }

    public function checkoutSuccess($orderID)
    {

        if (session()->has("success")) {

            $order = Order::find($orderID);
            return Inertia::render('OrderConfirmation', ['order' => $order]);

        }

        return to_route("shop");

    }

}
