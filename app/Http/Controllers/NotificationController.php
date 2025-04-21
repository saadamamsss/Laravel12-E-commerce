<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class NotificationController extends Controller
{
    //

    public function markGroupAsRead(Request $request)
    {

        $validated = $request->validate([
            'ids' => 'required|array'
        ]);
        try {
            //code...
            auth()->user()
                ->notifications()
                ->whereIn('id', $validated['ids'])
                ->update(['read_at' => Carbon::now()]);

            return response()->json(['success' => true]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['success' => false]);
        }
    }
    public function markAllAsRead()
    {
        auth()->user()
            ->notifications()
            ->where('read_at', null)
            ->update(['read_at' => Carbon::now()]);

        return response()->json(['success' => true]);
    }
}
