<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->constrained()->restrictOnDelete();
        });

        $categoryId = function (string $name, string $type) {
            $existing = DB::table('categories')->where('name', $name)->where('type', $type)->first();
            if ($existing) return $existing->id;
            $base = Str::slug($type.'-'.$name) ?: $type.'-category';
            $slug = $base;
            $suffix = 2;
            while (DB::table('categories')->where('slug', $slug)->exists()) $slug = $base.'-'.$suffix++;
            return DB::table('categories')->insertGetId([
                'name' => $name, 'slug' => $slug, 'type' => $type, 'is_active' => true,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        };
        DB::table('blog_posts')->orderBy('id')->each(function ($post) use ($categoryId) {
            $name = trim($post->category ?? '') ?: 'General';
            DB::table('blog_posts')->where('id', $post->id)->update(['category_id' => $categoryId($name, 'blog'), 'category' => $name]);
        });
        DB::table('media')->orderBy('id')->each(function ($media) use ($categoryId) {
            $category = DB::table('categories')->where('id', $media->category_id)->first();
            if ($category && $category->type === $media->type) return;
            DB::table('media')->where('id', $media->id)->update(['category_id' => $categoryId($category->name ?? 'General', $media->type)]);
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('category_id');
        });
    }
};
