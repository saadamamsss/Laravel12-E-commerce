<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Review;
use App\Models\User;
use App\Models\UserAddress;
use App\Notifications\OrderNotification;
use App\Notifications\ReviewNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }


    public function showAddress()
    {

        $address = UserAddress::where("userId", Auth::user()->id)->get()->each(function ($addr) {
            $addr->is_default = $addr->id === Auth::user()->default_address_id;
        });

        return Inertia::render("Address", ['addresses' => $address]);
    }

    public function setDefaultAddress()
    {

        return response()->json(['success' => true]);

    }
    public function deleteAddress()
    {

        return response()->json(['success' => true]);

    }
    public function addNewAddress()
    {

        return response()->json(['success' => true]);

    }
    public function updateAddress(Request $request)
    {





        return response()->json(['success' => true, 'data' => $request]);

    }


    public function paymentMethods()
    {
        return Inertia::render("PaymentMethods");
    }



    public function addReview(Request $request)
    {

        $validated = $request->validate([
            'review' => 'required|string|max:1000',
            'rate' => 'required|numeric|in:0,1,2,3,4,5',
            'productId' => 'required|numeric'
        ]);

        try {

            //code...
            $review = Review::create([
                'review' => $validated['review'],
                'rate' => $validated['rate'],
                'userId' => Auth::user()->id,
                'productId' => $validated['productId']
            ]);

            $review->user;

            $review->user->notify(new ReviewNotification($review, "A review has been added on the product " . $review->product->SKU . " by " . $review->user->name));

            return response()->json(["success" => true, "data" => $review], 200);

        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(["success" => false, 'msg' => $th->getMessage()], 500);
        }


    }
}
