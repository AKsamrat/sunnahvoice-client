<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_each_media_type_combines_search_category_and_pagination(): void
    {
        foreach (['image', 'video', 'audio'] as $type) {
            $category = Category::create(['name' => 'Selected '.$type, 'slug' => 'selected-'.$type, 'type' => $type]);
            $other = Category::create(['name' => 'Other '.$type, 'slug' => 'other-'.$type, 'type' => $type]);
            foreach (range(1, 12) as $index) {
                Media::create([
                    'title' => $index === 12 ? 'Unrelated' : 'Peaceful reminder',
                    'slug' => $type.'-'.$index, 'type' => $type,
                    'category_id' => $index === 11 ? $other->id : $category->id,
                    'file_path' => 'file.mp4', 'status' => 'published',
                ]);
            }
            $url = '/api/v1/media?type='.$type.'&category='.$category->slug.'&search=Peaceful&per_page=9';
            $this->getJson($url)->assertOk()->assertJsonPath('total', 10)->assertJsonCount(9, 'data');
            $this->getJson($url.'&page=2')->assertOk()->assertJsonPath('total', 10)->assertJsonCount(1, 'data')->assertJsonPath('data.0.type', $type)->assertJsonPath('data.0.category.id', $category->id);
            $this->getJson($url.'&search=unmatched')->assertJsonPath('total', 0);
            $this->getJson('/api/v1/media?type='.$type)->assertJsonPath('total', 12);
        }
    }

    public function test_blog_search_and_category_filter_apply_before_pagination(): void
    {
        foreach (range(1, 9) as $index) {
            BlogPost::create([
                'title' => 'Article '.$index, 'slug' => 'article-'.$index,
                'content' => 'Article content', 'excerpt' => $index === 9 ? 'Unrelated' : 'Peaceful reflection',
                'category' => $index === 8 ? 'Other' : 'Worship', 'status' => 'published',
            ]);
        }
        $url = '/api/v1/posts?category=Worship&search=Peaceful&per_page=6';
        $this->getJson($url)->assertOk()->assertJsonPath('total', 7)->assertJsonCount(6, 'data');
        $this->getJson($url.'&page=2')->assertJsonCount(1, 'data')->assertJsonPath('data.0.category', 'Worship');
        $this->getJson('/api/v1/posts?search=unmatched')->assertJsonPath('total', 0);
        $this->getJson('/api/v1/posts')->assertJsonPath('total', 9);
    }
}
