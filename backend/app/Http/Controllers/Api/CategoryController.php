<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $admin = $request->is('api/v1/admin/*');
        $categories = Category::query()
            ->withCount([
                'media' => fn ($query) => $admin ? $query->withTrashed() : $query->where('status', 'published'),
                'posts' => fn ($query) => $admin ? $query->withTrashed() : $query->where('status', 'published'),
            ])
            ->when(! $admin, fn ($query) => $query->where('is_active', true))
            ->when($request->string('type')->toString(), fn ($query, $type) => $query->where('type', $type))
            ->orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $category = Category::create($this->validated($request));
        return response()->json($category->loadCount(['media', 'posts']), 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $this->validated($request, $category);
        if (($data['type'] !== $category->type || ! ($data['is_active'] ?? $category->is_active)) && $this->hasContent($category)) {
            throw ValidationException::withMessages(['type' => 'Move the content to another category before changing its type or deactivating it.']);
        }
        DB::transaction(function () use ($category, $data) {
            $category->update($data);
            $category->posts()->withTrashed()->update(['category' => $category->name]);
        });
        return response()->json($category->fresh()->loadCount(['media', 'posts']));
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($this->hasContent($category)) {
            throw ValidationException::withMessages(['category' => 'Move all content, including trashed items, to another category before deleting this category.']);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }

    private function hasContent(Category $category): bool
    {
        return $category->media()->withTrashed()->exists() || $category->posts()->withTrashed()->exists();
    }

    private function validated(Request $request, ?Category $category = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120', Rule::unique('categories')->where('type', $request->input('type'))->ignore($category)],
            'slug' => ['nullable', 'string', 'max:140', Rule::unique('categories')->ignore($category)],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['image', 'video', 'audio', 'blog'])],
            'is_active' => ['boolean'],
        ]);
        if (empty($data['slug'])) {
            $base = Str::slug($data['type'].'-'.$data['name']) ?: $data['type'].'-category';
            $data['slug'] = $category?->slug ?? $base;
            $suffix = 2;
            while (Category::where('slug', $data['slug'])->when($category, fn ($query) => $query->where('id', '!=', $category->id))->exists()) {
                $data['slug'] = $base.'-'.$suffix++;
            }
        }
        return $data;
    }
}
