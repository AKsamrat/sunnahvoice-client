<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DownloadEvent extends Model
{
    protected $fillable = ['media_id', 'user_id', 'ip_address', 'user_agent', 'completed_at'];

    protected function casts(): array
    {
        return ['completed_at' => 'datetime'];
    }
}
