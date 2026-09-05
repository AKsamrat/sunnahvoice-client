<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class VisitorController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'visitor_id' => ['required', 'uuid'],
            'event_id' => ['required', 'uuid'],
            'path' => ['required', 'string', 'max:2048', 'starts_with:/'],
        ]);
        $ua = substr($request->userAgent() ?? '', 0, 1024);
        if (preg_match('/bot|crawler|spider|slurp|headless|preview/i', $ua) || preg_match('#^/(dashboard|login|register)(/|$)#', $data['path'])) {
            return response()->json(['tracked' => false]);
        }
        $hash = hash_hmac('sha256', $data['visitor_id'], config('app.key'));
        [$os, $browser] = $this->device($ua);
        DB::transaction(function () use ($hash, $os, $browser, $data) {
            DB::table('website_visitors')->insertOrIgnore([
                'visitor_hash' => $hash, 'os' => $os, 'browser' => $browser, 'created_at' => now(),
            ]);
            $visitorId = DB::table('website_visitors')->where('visitor_hash', $hash)->value('id');
            DB::table('website_page_views')->insertOrIgnore([
                'event_id' => $data['event_id'], 'visitor_id' => $visitorId, 'created_at' => now(),
            ]);
        });
        return response()->json(['tracked' => true], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate(['days' => ['sometimes', Rule::in(['7', '30', '90', 'all'])]]);
        $days = $data['days'] ?? '30';
        $start = $days === 'all' ? null : now()->startOfDay()->subDays((int) $days - 1);
        $views = DB::table('website_page_views')->when($start, fn ($query) => $query->where('created_at', '>=', $start));
        $visitors = DB::table('website_visitors')->whereIn('id', (clone $views)->select('visitor_id'));
        $breakdown = fn (string $column) => (clone $visitors)->select($column.' as name')
            ->selectRaw('COUNT(*) as count')->groupBy($column)->orderByDesc('count')->orderBy($column)->get()
            ->map(fn ($row) => ['name' => $row->name, 'count' => (int) $row->count]);
        return response()->json([
            'unique_visitors' => (clone $visitors)->count(),
            'page_views' => (clone $views)->count(),
            'visitors_today' => DB::table('website_page_views')->where('created_at', '>=', now()->startOfDay())->distinct()->count('visitor_id'),
            'operating_systems' => $breakdown('os'),
            'browsers' => $breakdown('browser'),
            'tracking_since' => DB::table('website_page_views')->min('created_at'),
            'timezone' => config('app.timezone'),
        ]);
    }

    private function device(string $ua): array
    {
        $os = match (true) {
            (bool) preg_match('/iPhone|iPad|iPod/i', $ua) => 'iOS / iPadOS',
            str_contains($ua, 'Android') => 'Android',
            str_contains($ua, 'Windows') => 'Windows',
            str_contains($ua, 'CrOS') => 'ChromeOS',
            str_contains($ua, 'Macintosh') || str_contains($ua, 'Mac OS X') => 'macOS',
            str_contains($ua, 'Linux') => 'Linux',
            default => 'Other / Unknown',
        };
        $browser = match (true) {
            (bool) preg_match('/Edg(?:e|A|iOS)?\//', $ua) => 'Microsoft Edge',
            (bool) preg_match('/OPR\/|Opera|OPiOS\//', $ua) => 'Opera',
            str_contains($ua, 'SamsungBrowser/') => 'Samsung Internet',
            (bool) preg_match('/Firefox\/|FxiOS\//', $ua) => 'Firefox',
            (bool) preg_match('/Chrome\/|CriOS\/|Chromium\//', $ua) => 'Chrome / Chromium',
            str_contains($ua, 'Safari/') => 'Safari',
            str_contains($ua, 'Trident/') || str_contains($ua, 'MSIE ') => 'Internet Explorer',
            default => 'Other / Unknown',
        };
        return [$os, $browser];
    }
}
