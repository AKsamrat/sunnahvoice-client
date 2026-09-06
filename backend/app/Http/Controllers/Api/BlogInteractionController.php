<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BlogInteractionController extends Controller
{
    private function published(BlogPost $post): void
    {
        abort_unless($post->status === 'published', 404);
    }

    public function index(Request $request, BlogPost $post): JsonResponse
    {
        $this->published($post);
        $request->validate(['page' => ['sometimes', 'integer', 'min:1']]);
        $viewer = $request->user('sanctum');
        $active = $viewer && $viewer->is_active;
        $comments = DB::table('blog_comments as comments')->join('users', 'users.id', '=', 'comments.user_id')
            ->where('comments.blog_post_id', $post->id)->select('comments.id', 'comments.body', 'comments.created_at', 'comments.user_id', 'users.name as author')
            ->orderByDesc('comments.created_at')->orderByDesc('comments.id')->paginate(10);
        $comments->through(fn ($comment) => [
            'id' => $comment->id, 'body' => $comment->body, 'author' => $comment->author,
            'created_at' => $comment->created_at,
            'can_delete' => $active && ($viewer->id === $comment->user_id || $viewer->role === 'admin'),
        ]);
        return response()->json([
            'comments' => $comments,
            'likes_count' => DB::table('blog_likes')->where('blog_post_id', $post->id)->count(),
            'liked' => $active && DB::table('blog_likes')->where('blog_post_id', $post->id)->where('user_id', $viewer->id)->exists(),
            'can_interact' => (bool) $active,
        ]);
    }

    public function comment(Request $request, BlogPost $post): JsonResponse
    {
        $this->published($post);
        abort_unless($request->user()->is_active, 403);
        if (is_string($request->input('body'))) $request->merge(['body' => trim($request->input('body'))]);
        $data = $request->validate(['body' => ['required', 'string', 'max:2000']]);
        DB::table('blog_comments')->insert([
            'blog_post_id' => $post->id, 'user_id' => $request->user()->id,
            'body' => $data['body'], 'created_at' => now(), 'updated_at' => now(),
        ]);
        return response()->json(['message' => 'Comment posted.'], 201);
    }

    public function destroy(Request $request, BlogPost $post, int $comment): JsonResponse
    {
        $this->published($post);
        abort_unless($request->user()->is_active, 403);
        $entry = DB::table('blog_comments')->where('id', $comment)->where('blog_post_id', $post->id)->first();
        abort_unless($entry, 404);
        abort_unless($request->user()->id === $entry->user_id || $request->user()->role === 'admin', 403);
        DB::table('blog_comments')->where('id', $entry->id)->delete();
        return response()->json(['message' => 'Comment removed.']);
    }

    public function like(Request $request, BlogPost $post): JsonResponse
    {
        $this->published($post);
        abort_unless($request->user()->is_active, 403);
        $data = $request->validate(['liked' => ['required', 'boolean']]);
        $identity = ['blog_post_id' => $post->id, 'user_id' => $request->user()->id];
        if ($data['liked']) {
            DB::table('blog_likes')->insertOrIgnore($identity + ['created_at' => now(), 'updated_at' => now()]);
        } else {
            DB::table('blog_likes')->where($identity)->delete();
        }
        return response()->json([
            'liked' => (bool) $data['liked'],
            'likes_count' => DB::table('blog_likes')->where('blog_post_id', $post->id)->count(),
        ]);
    }
}
