<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_migration_assigns_legacy_content_to_typed_categories(): void
    {
        $migration = require database_path('migrations/2026_09_06_000000_add_blog_category_id.php');
        $migration->down();
        $post = BlogPost::create(['title' => 'Legacy post', 'slug' => 'legacy-post', 'content' => 'Content', 'category' => 'Worship']);
        $media = Media::create(['title' => 'Legacy audio', 'slug' => 'legacy-audio', 'type' => 'audio', 'file_path' => 'audio.mp3']);
        $shared = Category::create(['name' => 'Shared', 'slug' => 'shared']);
        $image = Media::create(['title' => 'Legacy image', 'slug' => 'legacy-image', 'type' => 'image', 'file_path' => 'image.jpg', 'category_id' => $shared->id]);
        $migration->up();
        $this->assertSame('blog', $post->fresh()->topic->type);
        $this->assertSame('Worship', $post->fresh()->topic->name);
        $this->assertSame('audio', $media->fresh()->category->type);
        $this->assertSame('image', $image->fresh()->category->type);
        $this->assertSame('Shared', $image->fresh()->category->name);
    }

    public function test_only_admins_can_manage_categories(): void
    {
        $this->postJson('/api/v1/admin/categories', ['name' => 'Quran', 'type' => 'audio'])->assertUnauthorized();
        $this->actingAs(User::factory()->create(['role' => 'user']))->getJson('/api/v1/admin/categories')->assertForbidden();
        $this->postJson('/api/v1/admin/categories', ['name' => 'Quran', 'type' => 'audio'])->assertForbidden();
    }

    public function test_categories_support_all_types_and_unique_generated_slugs(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        foreach (['audio', 'video', 'image', 'blog'] as $type) {
            $this->postJson('/api/v1/admin/categories', ['name' => 'Quran', 'type' => $type])
                ->assertCreated()->assertJsonPath('slug', $type.'-quran');
            $this->getJson('/api/v1/categories?type='.$type)->assertJsonCount(1)->assertJsonPath('0.type', $type);
        }
        $this->postJson('/api/v1/admin/categories', ['name' => 'Quran', 'type' => 'audio'])->assertUnprocessable()->assertJsonValidationErrors('name');
        $this->postJson('/api/v1/admin/categories', ['name' => 'Missing type'])->assertUnprocessable()->assertJsonValidationErrors('type');
    }

    public function test_media_requires_an_active_category_matching_its_type(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $category = Category::create(['name' => 'Audio', 'slug' => 'audio', 'type' => 'audio']);
        $payload = ['title' => 'Image', 'type' => 'image', 'status' => 'draft', 'file' => UploadedFile::fake()->image('image.jpg')];
        $this->postJson('/api/v1/admin/media', $payload)->assertUnprocessable()->assertJsonValidationErrors('category_id');
        $payload['category_id'] = $category->id;
        $this->postJson('/api/v1/admin/media', $payload)->assertUnprocessable()->assertJsonValidationErrors('category_id');
        $category->update(['type' => 'image', 'is_active' => false]);
        $this->postJson('/api/v1/admin/media', $payload)->assertUnprocessable()->assertJsonValidationErrors('category_id');
        $category->update(['is_active' => true]);
        $this->postJson('/api/v1/admin/media', $payload)->assertCreated()->assertJsonPath('category_id', $category->id);
    }

    public function test_blog_category_is_required_and_renames_preserve_filtering(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $category = Category::create(['name' => 'Reflection', 'slug' => 'reflection', 'type' => 'audio']);
        $payload = ['title' => 'A reminder', 'content' => 'Article content', 'status' => 'published'];
        $this->postJson('/api/v1/admin/posts', $payload)->assertUnprocessable()->assertJsonValidationErrors('category_id');
        $payload['category_id'] = $category->id;
        $this->postJson('/api/v1/admin/posts', $payload)->assertUnprocessable()->assertJsonValidationErrors('category_id');
        $category->update(['type' => 'blog']);
        $this->postJson('/api/v1/admin/posts', $payload)->assertCreated()->assertJsonPath('category_id', $category->id);
        $this->patchJson('/api/v1/admin/categories/'.$category->id, ['name' => 'Worship', 'type' => 'blog'])->assertOk();
        $this->getJson('/api/v1/posts?category=Worship')->assertJsonPath('total', 1)->assertJsonPath('data.0.topic.name', 'Worship');
        $this->deleteJson('/api/v1/admin/categories/'.$category->id)->assertUnprocessable();
        $this->patchJson('/api/v1/admin/categories/'.$category->id, ['name' => 'Worship', 'type' => 'audio'])->assertUnprocessable();
        $this->patchJson('/api/v1/admin/categories/'.$category->id, ['name' => 'Worship', 'type' => 'blog', 'is_active' => false])->assertUnprocessable();
        BlogPost::first()->delete();
        $this->deleteJson('/api/v1/admin/categories/'.$category->id)->assertUnprocessable();
    }

    public function test_media_categories_cannot_be_deleted_while_used_and_empty_ones_can(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $category = Category::create(['name' => 'Audio', 'slug' => 'audio', 'type' => 'audio']);
        $media = Media::create(['category_id' => $category->id, 'title' => 'Track', 'slug' => 'track', 'type' => 'audio', 'file_path' => 'track.mp3']);
        $this->deleteJson('/api/v1/admin/categories/'.$category->id)->assertUnprocessable();
        $media->delete();
        $this->deleteJson('/api/v1/admin/categories/'.$category->id)->assertUnprocessable();
        $media->forceDelete();
        $this->deleteJson('/api/v1/admin/categories/'.$category->id)->assertOk();
    }
}
