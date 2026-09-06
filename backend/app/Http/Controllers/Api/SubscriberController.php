<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriberController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (is_string($request->input('email'))) {
            $request->merge(['email' => Str::lower(trim($request->input('email')))]);
        }
        $data = $request->validate(['email' => ['required', 'email', 'max:255']]);
        Subscriber::firstOrCreate(['email' => $data['email']]);
        return response()->json(['message' => "You're on the list. JazakAllahu khayran."], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);
        $query = Subscriber::query()->when($data['search'] ?? null, fn ($query, $search) => $query->where('email', 'like', '%'.trim($search).'%'));
        return response()->json([
            'total_subscribers' => Subscriber::count(),
            'subscribers' => $query->latest()->orderByDesc('id')->paginate(15),
        ]);
    }

    public function destroy(Subscriber $subscriber): JsonResponse
    {
        $subscriber->delete();
        return response()->json(['message' => 'Subscriber removed.']);
    }
}
