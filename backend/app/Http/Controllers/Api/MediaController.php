<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DownloadEvent;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Media::query()->with('category:id,name,slug');

        if (! $request->is('api/v1/admin/*')) {
            $query->where('status', 'published')
                ->where(fn ($query) => $query->whereNull('published_at')->orWhere('published_at', '<=', now()));
        }

        $query->when($request->string('type')->toString(), fn ($query, $type) => $query->where('type', $type));
        $query->when($request->string('category')->toString(), fn ($query, $slug) => $query->whereHas('category', fn ($query) => $query->where('slug', $slug)));
        $query->when($request->string('search')->toString(), fn ($query, $search) => $query->where(fn ($query) => $query->where('title', 'like', "%{$search}%")->orWhere('description', 'like', "%{$search}%")));

        return response()->json($query->latest('published_at')->orderByDesc('id')->paginate($request->integer('per_page', 12)));
    }

    public function show(Media $media): JsonResponse
    {
        abort_unless($media->status === 'published', 404);
        $media->increment('views');

        return response()->json($media->fresh()->load('category:id,name,slug'));
    }

    public function store(Request $request): JsonResponse
    {
        $media = Media::create($this->validatedData($request) + ['user_id' => $request->user()->id]);

        return response()->json($media->load('category'), 201);
    }

    public function update(Request $request, Media $media): JsonResponse
    {
        $media->update($this->validatedData($request, $media));

        return response()->json($media->fresh()->load('category'));
    }

    public function destroy(Media $media): JsonResponse
    {
        $media->delete();

        return response()->json(['message' => 'Media moved to trash.']);
    }

    public function download(Request $request, Media $media): JsonResponse
    {
        abort_unless($media->status === 'published', 404);

        DownloadEvent::create([
            'media_id' => $media->id,
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'completed_at' => now(),
        ]);
        $media->increment('downloads');

        $url = Str::startsWith($media->file_path, ['http://', 'https://'])
            ? $media->file_path
            : Storage::disk('public')->url($media->file_path);

        return response()->json(['download_url' => $url]);
    }

    private function validatedData(Request $request, ?Media $media = null): array
    {
        $data = $request->validate([
            'category_id' => ['required', Rule::exists('categories', 'id')->where(fn ($query) => $query->where('type', $request->input('type'))->where('is_active', true))],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('media')->ignore($media)],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['image', 'video', 'audio'])],
            'cover' => ['nullable', 'image', 'max:5120'],
            'file' => [$media ? 'nullable' : 'required', 'file', 'max:102400'],
            'duration' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
        ]);

        if (! isset($data['slug']) && ! $media) {
            $data['slug'] = Str::slug($data['title']).'-'.Str::lower(Str::random(5));
        }

        if (($data['status'] ?? null) === 'published' && ! $media?->published_at && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $request->file('cover')->store('covers', 'public');
        }
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store($data['type'], 'public');
            $data['file_size'] = $request->file('file')->getSize();
        }

        unset($data['cover'], $data['file']);

        return $data;
    }
}
