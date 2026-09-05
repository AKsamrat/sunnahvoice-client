<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::query()->with(['author:id,name', 'topic:id,name,slug']);

        if (! $request->is('api/v1/admin/*')) {
            $query->where('status', 'published');
        }
        $query->when($request->string('category')->toString(), fn ($query, $category) => $query->where('category', $category));
        $query->when($request->boolean('featured'), fn ($query) => $query->where('is_featured', true));
        $query->when($request->string('search')->toString(), fn ($query, $search) => $query->where(fn ($query) => $query->where('title', 'like', "%{$search}%")->orWhere('excerpt', 'like', "%{$search}%")->orWhere('category', 'like', "%{$search}%")));

        return response()->json($query->latest('published_at')->orderByDesc('id')->paginate($request->integer('per_page', 9)));
    }

    public function show(BlogPost $post): JsonResponse
    {
        abort_unless($post->status === 'published', 404);
        $post->increment('views');

        return response()->json($post->fresh()->load(['author:id,name', 'topic:id,name,slug']));
    }

    public function store(Request $request): JsonResponse
    {
        $post = BlogPost::create($this->validatedData($request) + ['user_id' => $request->user()->id]);

        return response()->json($post->load('topic:id,name,slug'), 201);
    }

    public function update(Request $request, BlogPost $post): JsonResponse
    {
        $post->update($this->validatedData($request, $post));

        return response()->json($post->fresh());
    }

    public function destroy(BlogPost $post): JsonResponse
    {
        $post->delete();

        return response()->json(['message' => 'Post moved to trash.']);
    }

    private function validatedData(Request $request, ?BlogPost $post = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_posts')->ignore($post)],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'cover' => ['nullable', 'image', 'max:5120'],
            'category_id' => ['required', Rule::exists('categories', 'id')->where(fn ($query) => $query->where('type', 'blog')->where('is_active', true))],
            'is_featured' => ['boolean'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
        ]);
        $data['category'] = Category::findOrFail($data['category_id'])->name;
        if (! isset($data['slug']) && ! $post) {
            $data['slug'] = Str::slug($data['title']).'-'.Str::lower(Str::random(5));
        }

        if (($data['status'] ?? null) === 'published' && ! $post?->published_at && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $request->file('cover')->store('blog', 'public');
        }
        unset($data['cover']);

        return $data;
    }
}
