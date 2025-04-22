<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    @vite(['resources/css/app.css', 'resources/css/font-awesome.min.css', 'resources/css/bootstrap.min.css', 'resources/css/owl.carousel.min.css', 'resources/css/flexslider.css', 'resources/css/style.css', 'resources/css/color-01.css'])

    
    <link rel="shortcut icon" href="{{ asset('assets/images/favicon.ico') }}" />

    <style>
        @font-face {
            font-family: "FontAwesome";
            src: url("/assets/fonts/fontawesome-webfont3e6e.eot?v=4.7.0");
            src: url("/assets/fonts/fontawesome-webfontd41d.eot?#iefix&v=4.7.0") format("embedded-opentype"),
                url("/assets/fonts/fontawesome-webfont3e6e.woff2?v=4.7.0") format("woff2"),
                url("/assets/fonts/fontawesome-webfont3e6e.woff?v=4.7.0") format("woff"),
                url("/assets/fonts/fontawesome-webfont3e6e.ttf?v=4.7.0") format("truetype"),
                url("/assets/fonts/fontawesome-webfont3e6e.svg?v=4.7.0#fontawesomeregular") format("svg");
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: "Font Awesome 6 Free";

            font-style: normal;

            font-weight: 900;

            font-display: block;

            src: url("/assets/webfonts/fa-solid-900.woff2") format("woff2"),
                url("/assets/webfonts/fa-solid-900.ttf") format("truetype");
        }
    </style>

    {{--  --}}
    @routes
    @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead
</head>

<body>

    <div>
        {{--  --}}
        @inertia
        {{--  --}}
    </div>

</body>
<script src="{{ asset('assets/js/jquery-1.12.4.minb8ff.js?ver=1.12.4') }}"></script>
<script src="{{ asset('assets/js/jquery-ui-1.12.4.minb8ff.js?ver=1.12.4') }}"></script>
<script src="{{ asset('assets/js/bootstrap.min.js') }}"></script>
<script src="{{ asset('assets/js/jquery.flexslider.js') }}"></script>
<script src="{{ asset('assets/js/owl.carousel.min.js') }}"></script>
<script src="{{ asset('assets/js/jquery.countdown.min.js') }}"></script>
<script src="{{ asset('assets/js/jquery.sticky.js') }}"></script>
<script async defer src="{{ asset('assets/js/main.js') }}"></script>

</html>
