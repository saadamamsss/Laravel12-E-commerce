<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Inertia\Inertia;


class ContactController extends Controller
{
    //

    public function Index(){

        
        return Inertia::render("Contact");
    }

    public function sendContactMessage(Request $request){
        $validate = $request->validate([
            'name'=> 'required|string|max:100',
            'email'=> 'required|string|max:100',
            'phone'=> 'nullable|string|max:20',
            'message'=> 'required|string|max:500'
        ]);

        try {
            $contact = Contact::create($validate);

            return back()->with('success', "Your Message was Sent successfully .");
        } catch (\Throwable $th) {
            //throw $th;
            return back()->with( 'error',"somthing went wrong!");

        }

    }
}
