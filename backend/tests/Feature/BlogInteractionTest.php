<?php
namespace Tests\Feature;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
class BlogInteractionTest extends TestCase {
 use RefreshDatabase;
 private function makePost(string $slug = 'reflection', string $status = 'published'): BlogPost {
  return BlogPost::create(['user_id'=>User::factory()->create(['is_active'=>true])->id,'title'=>'Reflection','slug'=>$slug,'excerpt'=>'A reflection','content'=>'Article content','status'=>$status]);
 }
 public function test_guests_can_read_but_cannot_write(): void {
  $this->makePost();
  $this->getJson('/api/v1/posts/reflection/interactions')->assertOk()->assertJsonPath('can_interact',false)->assertJsonPath('likes_count',0);
  $this->postJson('/api/v1/posts/reflection/comments',['body'=>'Hello'])->assertUnauthorized();
  $this->putJson('/api/v1/posts/reflection/like',['liked'=>true])->assertUnauthorized();
 }
 public function test_comments_validate_and_enforce_ownership(): void {
  $this->makePost(); $this->makePost('another');
  $owner=User::factory()->create(['is_active'=>true]); $this->actingAs($owner);
  $this->postJson('/api/v1/posts/reflection/comments',['body'=>'  Thoughtful article  ','user_id'=>999])->assertCreated();
  $this->assertDatabaseHas('blog_comments',['body'=>'Thoughtful article','user_id'=>$owner->id]);
  $this->postJson('/api/v1/posts/reflection/comments',['body'=>'  '])->assertUnprocessable();
  $this->postJson('/api/v1/posts/reflection/comments',['body'=>str_repeat('a',2001)])->assertUnprocessable();
  $id=DB::table('blog_comments')->value('id');
  $this->deleteJson('/api/v1/posts/another/comments/'.$id)->assertNotFound();
  $this->actingAs(User::factory()->create(['role'=>'user','is_active'=>true]));
  $this->deleteJson('/api/v1/posts/reflection/comments/'.$id)->assertForbidden();
  $this->actingAs($owner);
  $this->deleteJson('/api/v1/posts/reflection/comments/'.$id)->assertOk();
  $this->assertDatabaseCount('blog_comments',0);
 }
 public function test_likes_are_unique_and_can_be_removed(): void {
  $this->makePost(); $user=User::factory()->create(['is_active'=>true]); $this->actingAs($user);
  foreach(range(1,2) as $i) $this->putJson('/api/v1/posts/reflection/like',['liked'=>true])->assertOk()->assertJsonPath('likes_count',1);
  $this->actingAs(User::factory()->create(['is_active'=>true]));
  $this->putJson('/api/v1/posts/reflection/like',['liked'=>true])->assertJsonPath('likes_count',2);
  $this->actingAs($user);
  foreach(range(1,2) as $i) $this->putJson('/api/v1/posts/reflection/like',['liked'=>false])->assertOk()->assertJsonPath('likes_count',1)->assertJsonPath('liked',false);
 }
 public function test_public_endpoint_recognizes_bearer_token_and_paginates(): void {
  $post=$this->makePost(); $user=User::factory()->create(['is_active'=>true]);
  foreach(range(1,11) as $i) DB::table('blog_comments')->insert(['blog_post_id'=>$post->id,'user_id'=>$user->id,'body'=>'Comment '.$i,'created_at'=>now(),'updated_at'=>now()]);
  DB::table('blog_likes')->insert(['blog_post_id'=>$post->id,'user_id'=>$user->id,'created_at'=>now(),'updated_at'=>now()]);
  $this->getJson('/api/v1/posts/reflection/interactions')->assertJsonPath('liked',false)->assertJsonPath('comments.data.0.can_delete',false)->assertJsonCount(10,'comments.data');
  $token=$user->createToken('test')->plainTextToken;
  $this->withToken($token)->getJson('/api/v1/posts/reflection/interactions?page=2')->assertOk()->assertJsonPath('liked',true)->assertJsonPath('can_interact',true)->assertJsonPath('comments.data.0.can_delete',true)->assertJsonCount(1,'comments.data');
 }
 public function test_drafts_and_inactive_accounts_are_blocked_and_admin_can_moderate(): void {
  $this->makePost('draft','draft'); $post=$this->makePost();
  $this->getJson('/api/v1/posts/draft/interactions')->assertNotFound();
  $this->actingAs(User::factory()->create(['is_active'=>false]));
  $this->postJson('/api/v1/posts/reflection/comments',['body'=>'Hello'])->assertForbidden();
  $this->putJson('/api/v1/posts/reflection/like',['liked'=>true])->assertForbidden();
  $id=DB::table('blog_comments')->insertGetId(['blog_post_id'=>$post->id,'user_id'=>$post->user_id,'body'=>'Comment','created_at'=>now(),'updated_at'=>now()]);
  $this->actingAs(User::factory()->create(['role'=>'admin','is_active'=>true]));
  $this->deleteJson('/api/v1/posts/reflection/comments/'.$id)->assertOk();
  $this->postJson('/api/v1/posts/draft/comments',['body'=>'Hello'])->assertNotFound();
  $post->delete();
  $this->putJson('/api/v1/posts/reflection/like',['liked'=>true])->assertNotFound();
 }
}
