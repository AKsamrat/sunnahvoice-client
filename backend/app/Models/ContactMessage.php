<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = ['name', 'email', 'topic', 'subject', 'message', 'status', 'replied_at'];

    protected function casts(): array
    {
        return ['replied_at' => 'datetime'];
    }
}
