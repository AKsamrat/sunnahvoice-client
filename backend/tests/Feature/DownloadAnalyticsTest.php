<?php

namespace Tests\Feature;

use App\Models\DownloadEvent;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DownloadAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_access_download_analytics(): void
    {
        $this->getJson('/api/v1/admin/downloads')->assertUnauthorized();
        $this->actingAs(User::factory()->create(['role' => 'user']))->getJson('/api/v1/admin/downloads')->assertForbidden();
    }

    public function test_empty_data_and_invalid_filters(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $this->getJson('/api/v1/admin/downloads?days=7')->assertOk()->assertJsonPath('total', 0)
            ->assertJsonPath('by_type.image', 0)->assertJsonCount(7, 'daily')
            ->assertJsonPath('daily.0.count', 0)->assertJsonCount(0, 'top_media')->assertJsonPath('history.total', 0);
        $this->getJson('/api/v1/admin/downloads?days=bad&type=blog&page=0')->assertUnprocessable()->assertJsonValidationErrors(['days', 'type', 'page']);
    }

    public function test_totals_chart_rankings_and_history_use_the_same_filters(): void
    {
        $this->travelTo(now()->startOfDay()->addHours(12));
        $image = Media::create(['title' => 'Image', 'slug' => 'image', 'type' => 'image', 'file_path' => 'image.jpg']);
        $audio = Media::create(['title' => 'Audio', 'slug' => 'audio', 'type' => 'audio', 'file_path' => 'audio.mp3']);
        foreach (range(1, 12) as $index) {
            DownloadEvent::create(['media_id' => $image->id, 'completed_at' => now()->subMinutes($index)]);
        }
        DownloadEvent::create(['media_id' => $audio->id, 'completed_at' => now()->subDays(1)]);
        DownloadEvent::create(['media_id' => $audio->id, 'completed_at' => now()->subDays(8)]);
        DownloadEvent::create(['media_id' => $audio->id, 'completed_at' => null]);
        DownloadEvent::create(['media_id' => $audio->id, 'completed_at' => now()->addDay()]);
        $image->delete();
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $response = $this->getJson('/api/v1/admin/downloads?days=7')->assertOk()
            ->assertJsonPath('total', 13)->assertJsonPath('by_type.image', 12)->assertJsonPath('by_type.audio', 1)
            ->assertJsonPath('by_type.video', 0)->assertJsonPath('daily.6.count', 12)->assertJsonPath('daily.5.count', 1)
            ->assertJsonPath('top_media.0.title', 'Image')->assertJsonPath('top_media.0.count', 12)
            ->assertJsonPath('history.total', 13)->assertJsonCount(10, 'history.data');
        $this->assertSame(13, array_sum(array_column($response->json('daily'), 'count')));
        $firstPageIds = array_column($response->json('history.data'), 'id');
        $secondPage = $this->getJson('/api/v1/admin/downloads?days=7&page=2')->assertOk()->assertJsonCount(3, 'history.data')->assertJsonPath('total', 13);
        $this->assertEmpty(array_intersect($firstPageIds, array_column($secondPage->json('history.data'), 'id')));
        $this->getJson('/api/v1/admin/downloads?days=7&type=audio')->assertJsonPath('total', 1)->assertJsonPath('by_type.image', 0)->assertJsonPath('history.data.0.type', 'audio');
        $this->getJson('/api/v1/admin/downloads?days=30&type=audio')->assertJsonPath('total', 2);
    }

    public function test_public_download_is_visible_in_analytics(): void
    {
        Media::create(['title' => 'Video', 'slug' => 'video', 'type' => 'video', 'file_path' => 'https://example.com/video.mp4', 'status' => 'published']);
        $this->postJson('/api/v1/media/video/download')->assertOk();
        $this->actingAs(User::factory()->create(['role' => 'admin']))->getJson('/api/v1/admin/downloads')->assertOk()->assertJsonPath('total', 1)->assertJsonPath('history.data.0.title', 'Video');
    }
}
