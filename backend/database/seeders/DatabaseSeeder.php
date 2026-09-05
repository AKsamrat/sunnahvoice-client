<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        collect([
            ['name' => 'Mosques', 'slug' => 'mosques', 'type' => 'image'],
            ['name' => 'Nature', 'slug' => 'nature', 'type' => 'image'],
            ['name' => 'Islamic reminders', 'slug' => 'islamic-reminders', 'type' => 'video'],
            ['name' => 'Quran recitation', 'slug' => 'quran-recitation', 'type' => 'audio'],
            ['name' => 'Nasheed', 'slug' => 'nasheed', 'type' => 'audio'],
        ])->each(fn (array $category) => Category::updateOrCreate(
            ['slug' => $category['slug']],
            $category
        ));

        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@sunnahvoice.test')],
            [
                'name' => 'SunnahVoice Admin',
                'password' => env('ADMIN_PASSWORD', 'ChangeMe123!'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $admin = User::where('email', env('ADMIN_EMAIL', 'admin@sunnahvoice.test'))->first();
        $cover = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=85';
        $mediaGroups = [
            'image' => ['Quran at Dawn', 'Minarets at Sunset', 'Sacred Geometry', 'Peaceful Masjid', 'Light Upon Light', 'Journey to Makkah'],
            'video' => ['Peace in Salah', 'The Power of Sabr', 'Lessons from Hijrah', 'Kindness Is Worship', 'The Gift of Friday', 'A Quiet Reminder'],
            'audio' => ['Surah Ar-Rahman', 'Morning Adhkar', 'Surah Al-Mulk', 'Dua for Tranquility', 'Evening Adhkar', 'Surah Al-Kahf'],
        ];

        foreach ($mediaGroups as $type => $titles) {
            foreach ($titles as $index => $title) {
                Media::updateOrCreate(
                    ['slug' => str($title)->slug()->toString()],
                    [
                        'category_id' => Category::where('type', $type)->firstOrFail()->id,
                        'user_id' => $admin->id,
                        'title' => $title,
                        'subtitle' => 'Beneficial Islamic media for reflection',
                        'description' => 'A carefully selected SunnahVoice resource created for peaceful moments of learning and remembrance.',
                        'type' => $type,
                        'cover_path' => $cover,
                        'file_path' => match ($type) {
                            'image' => $cover.'&full='.$index,
                            'video' => 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
                            default => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                        },
                        'duration' => $type === 'image' ? null : 180 + ($index * 42),
                        'status' => 'published',
                        'published_at' => now()->subDays($index),
                    ]
                );
            }
        }

        foreach ([
            ['A Daily Relationship with the Quran', 'Quran', true],
            ['Finding Khushu in a Distracted World', 'Worship', false],
            ['The Quiet Power of Morning Adhkar', 'Dhikr', false],
        ] as [$title, $category, $featured]) {
            BlogPost::updateOrCreate(
                ['slug' => str($title)->slug()->toString()],
                [
                    'user_id' => $admin->id,
                    'title' => $title,
                    'excerpt' => 'A practical reflection for bringing faith, remembrance and intention into everyday life.',
                    'content' => "Small, consistent acts shape the heart over time. Begin with a moment you can protect each day.\n\nMake the practice simple, sincere and connected to reliable knowledge. Return to it gently whenever life becomes busy.",
                    'cover_path' => $cover,
                    'category_id' => Category::firstOrCreate(['name' => $category, 'type' => 'blog'], ['slug' => 'blog-'.str($category)->slug(), 'is_active' => true])->id,
                    'category' => $category,
                    'is_featured' => $featured,
                    'status' => 'published',
                    'published_at' => now(),
                ]
            );
        }
    }
}
