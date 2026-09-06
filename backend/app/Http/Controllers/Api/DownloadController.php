<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DownloadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'days' => ['sometimes', Rule::in(['7', '30', '90'])],
            'type' => ['sometimes', Rule::in(['all', 'image', 'video', 'audio'])],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);
        $days = (int) ($data['days'] ?? 30);
        $type = $data['type'] ?? 'all';
        $start = now()->startOfDay()->subDays($days - 1);
        $events = DB::table('download_events as downloads')
            ->join('media', 'media.id', '=', 'downloads.media_id')
            ->whereBetween('downloads.completed_at', [$start, now()])
            ->when($type !== 'all', fn ($query) => $query->where('media.type', $type));
        $counts = (clone $events)->select('media.type')->selectRaw('COUNT(*) as total')->groupBy('media.type')->pluck('total', 'type');
        $dailyCounts = (clone $events)->selectRaw('DATE(downloads.completed_at) as day, COUNT(*) as total')->groupByRaw('DATE(downloads.completed_at)')->pluck('total', 'day');
        $daily = [];
        for ($offset = 0; $offset < $days; $offset++) {
            $date = $start->copy()->addDays($offset)->toDateString();
            $daily[] = ['date' => $date, 'count' => (int) ($dailyCounts[$date] ?? 0)];
        }
        $top = (clone $events)->select('media.id', 'media.title', 'media.type')
            ->selectRaw('COUNT(*) as count')->groupBy('media.id', 'media.title', 'media.type')
            ->orderByDesc('count')->orderBy('media.id')->limit(5)->get()
            ->map(fn ($item) => ['id' => $item->id, 'title' => $item->title, 'type' => $item->type, 'count' => (int) $item->count]);
        $history = (clone $events)->select('downloads.id', 'media.title', 'media.type', 'downloads.completed_at as downloaded_at')
            ->orderByDesc('downloads.completed_at')->orderByDesc('downloads.id')->paginate(10);
        return response()->json([
            'total' => (clone $events)->count(),
            'by_type' => ['image' => (int) ($counts['image'] ?? 0), 'video' => (int) ($counts['video'] ?? 0), 'audio' => (int) ($counts['audio'] ?? 0)],
            'daily' => $daily, 'top_media' => $top, 'history' => $history,
            'timezone' => config('app.timezone'),
        ]);
    }
}
