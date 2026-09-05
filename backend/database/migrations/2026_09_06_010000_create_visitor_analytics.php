<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_visitors', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_hash', 64)->unique();
            $table->string('os', 40);
            $table->string('browser', 40);
            $table->timestamp('created_at');
        });
        Schema::create('website_page_views', function (Blueprint $table) {
            $table->id();
            $table->uuid('event_id')->unique();
            $table->foreignId('visitor_id')->constrained('website_visitors')->cascadeOnDelete();
            $table->timestamp('created_at')->index();
            $table->index(['visitor_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_page_views');
        Schema::dropIfExists('website_visitors');
    }
};
