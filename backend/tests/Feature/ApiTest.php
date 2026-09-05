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

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Reader',
            'email' => 'reader@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()->assertJsonStructure(['user', 'token']);
        $this->assertDatabaseHas('users', ['email' => 'reader@example.com']);
    }

    public function test_admin_can_create_and_public_can_list_media(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->postJson('/api/v1/admin/media', [
            'category_id' => Category::create(['name' => 'Mosques', 'slug' => 'mosques', 'type' => 'image'])->id,
            'title' => 'Beautiful Mosque',
            'type' => 'image',
            'status' => 'published',
            'file' => UploadedFile::fake()->image('mosque.jpg'),
        ])->assertCreated();

        $this->getJson('/api/v1/media?type=image')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Beautiful Mosque');
    }

    public function test_download_is_recorded(): void
    {
        $media = Media::create([
            'title' => 'Surah Ar-Rahman',
            'slug' => 'surah-ar-rahman',
            'type' => 'audio',
            'file_path' => 'https://example.com/audio.mp3',
            'status' => 'published',
        ]);

        $this->postJson('/api/v1/media/surah-ar-rahman/download')
            ->assertOk()
            ->assertJsonPath('download_url', 'https://example.com/audio.mp3');
        $this->assertDatabaseHas('download_events', ['media_id' => $media->id]);
    }

    public function test_admin_can_update_status_and_delete_media(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $media = Media::create([
            'title' => 'Draft Reminder',
            'slug' => 'draft-reminder',
            'type' => 'video',
            'file_path' => 'video/reminder.mp4',
            'status' => 'draft',
        ]);

        $this->actingAs($admin)->patchJson('/api/v1/admin/media/draft-reminder', [
            'title' => $media->title,
            'category_id' => Category::create(['name' => 'Reminders', 'slug' => 'reminders', 'type' => 'video'])->id,
            'type' => $media->type,
            'status' => 'published',
        ])->assertOk()->assertJsonPath('status', 'published');

        $this->assertDatabaseHas('media', [
            'slug' => 'draft-reminder',
            'status' => 'published',
        ]);

        $this->actingAs($admin)
            ->deleteJson('/api/v1/admin/media/draft-reminder')
            ->assertOk();
        $this->assertSoftDeleted('media', ['id' => $media->id]);
    }

    public function test_contact_message_can_be_submitted(): void
    {
        $this->postJson('/api/v1/contact', [
            'name' => 'Visitor',
            'email' => 'visitor@example.com',
            'subject' => 'Question',
            'message' => 'Please tell me more about this project.',
        ])->assertCreated();
    }

    public function test_admin_can_manage_blog_posts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $created = $this->actingAs($admin)->postJson('/api/v1/admin/posts', [
            'title' => 'A Beneficial Reminder',
            'content' => 'This is the complete article content.',
            'category_id' => Category::firstOrCreate(['name' => 'Reflection', 'slug' => 'reflection', 'type' => 'blog'])->id,
            'is_featured' => true,
            'status' => 'draft',
        ])->assertCreated();

        $slug = $created->json('slug');
        $this->actingAs($admin)->patchJson("/api/v1/admin/posts/{$slug}", [
            'title' => 'A Beneficial Reminder',
            'content' => 'This is the updated article content.',
            'category_id' => Category::firstOrCreate(['name' => 'Reflection', 'slug' => 'reflection', 'type' => 'blog'])->id,
            'is_featured' => false,
            'status' => 'published',
        ])->assertOk()->assertJsonPath('status', 'published');

        $this->assertDatabaseHas('blog_posts', [
            'slug' => $slug,
            'status' => 'published',
        ]);

        $this->actingAs($admin)
            ->deleteJson("/api/v1/admin/posts/{$slug}")
            ->assertOk();
        $this->assertSoftDeleted(BlogPost::class, ['slug' => $slug]);
    }
}
