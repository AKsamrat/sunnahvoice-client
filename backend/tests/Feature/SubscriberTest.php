<?php

namespace Tests\Feature;

use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriberTest extends TestCase
{
    use RefreshDatabase;

    public function test_footer_signup_is_saved_and_normalized_without_duplicates(): void
    {
        $this->postJson('/api/v1/subscribe', ['email' => ' Reader@Example.com '])->assertCreated();
        $this->postJson('/api/v1/subscribe', ['email' => 'reader@example.com'])->assertCreated();
        $this->assertDatabaseCount('subscribers', 1);
        $this->assertDatabaseHas('subscribers', ['email' => 'reader@example.com']);
    }

    public function test_invalid_email_is_rejected(): void
    {
        $this->postJson('/api/v1/subscribe', ['email' => 'not-an-email'])->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->postJson('/api/v1/subscribe', ['email' => ['invalid']])->assertUnprocessable();
        $this->assertDatabaseCount('subscribers', 0);
    }

    public function test_admin_can_search_paginate_and_remove_subscribers(): void
    {
        foreach (range(1, 17) as $index) Subscriber::create(['email' => 'reader'.$index.'@example.com']);
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        $this->getJson('/api/v1/admin/subscribers')->assertOk()->assertJsonPath('total_subscribers', 17)->assertJsonCount(15, 'subscribers.data')->assertJsonPath('subscribers.last_page', 2);
        $this->getJson('/api/v1/admin/subscribers?page=2')->assertJsonCount(2, 'subscribers.data');
        $this->getJson('/api/v1/admin/subscribers?search=reader17@')->assertJsonPath('subscribers.total', 1)->assertJsonPath('subscribers.data.0.email', 'reader17@example.com');
        $subscriber = Subscriber::first();
        $this->deleteJson('/api/v1/admin/subscribers/'.$subscriber->id)->assertOk();
        $this->assertDatabaseMissing('subscribers', ['id' => $subscriber->id]);
    }

    public function test_subscriber_management_requires_admin(): void
    {
        $subscriber = Subscriber::create(['email' => 'private@example.com']);
        $this->getJson('/api/v1/admin/subscribers')->assertUnauthorized();
        $this->deleteJson('/api/v1/admin/subscribers/'.$subscriber->id)->assertUnauthorized();
        $this->actingAs(User::factory()->create(['role' => 'user']));
        $this->getJson('/api/v1/admin/subscribers')->assertForbidden();
        $this->deleteJson('/api/v1/admin/subscribers/'.$subscriber->id)->assertForbidden();
        $this->assertDatabaseCount('subscribers', 1);
    }
}
