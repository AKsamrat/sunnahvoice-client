<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $message = ContactMessage::create($request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'topic' => ['nullable', 'string', 'max:100'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]));

        return response()->json(['message' => 'Thank you. Your message has been received.', 'id' => $message->id], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $messages = ContactMessage::query()
            ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
            ->latest()->paginate($request->integer('per_page', 20));

        return response()->json($messages);
    }

    public function update(Request $request, ContactMessage $contact): JsonResponse
    {
        $data = $request->validate(['status' => ['required', Rule::in(['new', 'read', 'replied', 'archived'])]]);
        $data['replied_at'] = $data['status'] === 'replied' ? now() : $contact->replied_at;
        $contact->update($data);

        return response()->json($contact->fresh());
    }
}
