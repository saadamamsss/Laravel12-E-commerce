<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Transaction;
use App\Services\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Gloudemans\Shoppingcart\Facades\Cart;
use Inertia\Inertia;
class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripePaymentService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    public function checkout(Request $request)
    {

        try {
            $paymentIntent = $this->stripeService->createPaymentIntent(
                (float) Cart::instance('cart')->total(),
                'usd',
                ['user_id' => 1]
            );


            
            return Inertia::render('StripePayment', [
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
                'stripeKey' => config('services.stripe.key')
            ]);

        } catch (\Exception $e) {

            // return response()->json(['error' => 'Payment initialization failed: ' . $e->getMessage()]);

        }



    }



    protected function processStripePayment(string $paymentIntentId)
    {
        try {
            $paymentIntent = $this->stripeService->confirmPayment($paymentIntentId);


            return response()->json(['success', $paymentIntent]);


        } catch (\Exception $e) {
            // Log the error
            \Log::error('Stripe payment failed: ' . $e->getMessage());


            return response()->json(['Payment processing failed: ' . $e->getMessage()]);
        }
    }

}