<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mortality_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('flock_id')->constrained()->onDelete('cascade');
            $table->date('log_date');
            $table->unsignedInteger('quantity');
            $table->enum('cause', [
                'disease', 'injury', 'unknown', 'predator',
                'heat_stress', 'cold_stress', 'culled', 'suffocation', 'other'
            ])->default('unknown');
            $table->string('specific_cause')->nullable();
            $table->enum('disposal_method', ['buried', 'incinerated', 'composted', 'other'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mortality_logs');
    }
};
