<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\ContactMessage;
use App\Models\DownloadEvent;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'users' => User::count(),
            'media' => [
                'total' => Media::count(),
                'images' => Media::where('type', 'image')->count(),
                'videos' => Media::where('type', 'video')->count(),
                'audio' => Media::where('type', 'audio')->count(),
            ],
            'posts' => BlogPost::count(),
            'downloads' => DownloadEvent::whereNotNull('completed_at')->count(),
            'new_messages' => ContactMessage::where('status', 'new')->count(),
            'recent_media' => Media::latest()->limit(5)->get(),
        ]);
    }
}
