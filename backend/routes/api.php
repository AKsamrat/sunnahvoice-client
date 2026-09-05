<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MediaController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('auth/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('media', [MediaController::class, 'index']);
    Route::get('media/{media}', [MediaController::class, 'show']);
    Route::post('media/{media}/download', [MediaController::class, 'download'])->middleware('throttle:30,1');
    Route::get('posts', [BlogController::class, 'index']);
    Route::get('posts/{post}', [BlogController::class, 'show']);
    Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::get('categories', [CategoryController::class, 'index']);
            Route::get('dashboard', DashboardController::class);
            Route::get('media', [MediaController::class, 'index']);
            Route::get('posts', [BlogController::class, 'index']);
            Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
            Route::apiResource('media', MediaController::class)
                ->parameters(['media' => 'media'])
                ->except(['index', 'show']);
            Route::apiResource('posts', BlogController::class)->except(['index', 'show']);
            Route::get('contacts', [ContactController::class, 'index']);
            Route::patch('contacts/{contact}', [ContactController::class, 'update']);
        });
    });
});
