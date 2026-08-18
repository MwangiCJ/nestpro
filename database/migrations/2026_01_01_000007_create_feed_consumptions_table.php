<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_consumptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('flock_id')->constrained()->onDelete('cascade');
            $table->date('consumption_date');
            $table->string('feed_type');
            $table->string('brand')->nullable();
            $table->decimal('quantity_kg', 12, 2);
            $table->decimal('feed_per_bird', 8, 4)->nullable()->comment('kg per bird');
            $table->string('recorded_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_consumptions');
    }
};
