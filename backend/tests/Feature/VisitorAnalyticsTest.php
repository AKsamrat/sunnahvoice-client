<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class VisitorAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private function visit(string $visitor, string $ua, string $path = '/', ?string $event = null)
    {
        return $this->withHeaders(['User-Agent' => $ua])->postJson('/api/v1/visits', [
            'visitor_id' => $visitor, 'event_id' => $event ?? (string) Str::uuid(), 'path' => $path,
        ]);
    }

    public function test_tracking_deduplicates_events_and_separates_visitors_from_views(): void
    {
        $visitor = (string) Str::uuid();
        $event = (string) Str::uuid();
        $ua = 'Mozilla/5.0 (Windows NT 10.0) Chrome/130.0 Safari/537.36';
        $this->visit($visitor, $ua, '/', $event)->assertCreated();
        $this->visit($visitor, $ua, '/', $event)->assertCreated();
        $this->visit($visitor, $ua, '/audio')->assertCreated();
        $this->assertDatabaseCount('website_visitors', 1);
        $this->assertDatabaseCount('website_page_views', 2);
        $this->assertNotSame($visitor, DB::table('website_visitors')->value('visitor_hash'));
        $this->actingAs(User::factory()->create(['role' => 'admin']))->getJson('/api/v1/admin/visitors')
            ->assertOk()->assertJsonPath('unique_visitors', 1)->assertJsonPath('page_views', 2)
            ->assertJsonPath('operating_systems.0.name', 'Windows')->assertJsonPath('browsers.0.name', 'Chrome / Chromium');
    }

    public function test_browser_detection_prioritizes_distinctive_tokens(): void
    {
        $cases = [
            ['Mozilla/5.0 (Windows NT 10.0) Chrome/130 Safari/537 Edg/130', 'Windows', 'Microsoft Edge'],
            ['Mozilla/5.0 (Linux; Android 14) Chrome/130 Safari/537 SamsungBrowser/26', 'Android', 'Samsung Internet'],
            ['Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/130 Safari/537 OPR/115', 'macOS', 'Opera'],
            ['Mozilla/5.0 (iPhone; CPU iPhone OS 17) FxiOS/130 Mobile Safari/605', 'iOS / iPadOS', 'Firefox'],
            ['Mozilla/5.0 (iPad; CPU OS 17) Version/17 Mobile Safari/605', 'iOS / iPadOS', 'Safari'],
            ['Mozilla/5.0 (X11; CrOS x86_64) Chrome/130 Safari/537', 'ChromeOS', 'Chrome / Chromium'],
            ['Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/130', 'Linux', 'Firefox'],
            ['Unrecognized client', 'Other / Unknown', 'Other / Unknown'],
        ];
        foreach ($cases as [$ua, $os, $browser]) {
            $id = (string) Str::uuid();
            $this->visit($id, $ua)->assertCreated();
            $this->assertDatabaseHas('website_visitors', ['visitor_hash' => hash_hmac('sha256', $id, config('app.key')), 'os' => $os, 'browser' => $browser]);
        }
    }

    public function test_date_ranges_count_returning_visitors_and_empty_periods(): void
    {
        $this->travelTo(now()->startOfDay());
        $id = (string) Str::uuid();
        $this->visit($id, 'Firefox/130');
        $this->travel(40)->days();
        $this->visit($id, 'Firefox/130');
        $this->visit((string) Str::uuid(), 'Safari/605');
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $this->getJson('/api/v1/admin/visitors?days=7')->assertJsonPath('page_views', 2)->assertJsonPath('unique_visitors', 2)->assertJsonPath('visitors_today', 2);
        $this->getJson('/api/v1/admin/visitors?days=all')->assertJsonPath('page_views', 3)->assertJsonPath('unique_visitors', 2);
        $this->travel(8)->days();
        $this->getJson('/api/v1/admin/visitors?days=7')->assertJsonPath('page_views', 0)->assertJsonPath('unique_visitors', 0)->assertJsonCount(0, 'browsers');
    }

    public function test_invalid_requests_and_excluded_pages_do_not_create_visits(): void
    {
        $this->postJson('/api/v1/visits', ['visitor_id' => 'bad'])->assertUnprocessable();
        foreach (['/dashboard', '/dashboard/media', '/login', '/register'] as $path) {
            $this->visit((string) Str::uuid(), 'Chrome/130', $path)->assertOk()->assertJsonPath('tracked', false);
        }
        $this->visit((string) Str::uuid(), 'Googlebot/2.1')->assertOk()->assertJsonPath('tracked', false);
        $this->assertDatabaseCount('website_page_views', 0);
        $this->assertDatabaseCount('website_visitors', 0);
    }

    public function test_analytics_are_admin_only_and_validate_period(): void
    {
        $this->getJson('/api/v1/admin/visitors')->assertUnauthorized();
        $this->actingAs(User::factory()->create(['role' => 'user']))->getJson('/api/v1/admin/visitors')->assertForbidden();
        $this->actingAs(User::factory()->create(['role' => 'admin']))->getJson('/api/v1/admin/visitors?days=invalid')->assertUnprocessable();
    }
}
