<?php

use Illuminate\Support\Facades\Route;

// The Vue 3 single-page app is mounted from this Blade view
Route::get('/', function () {
    return view('app');
});
