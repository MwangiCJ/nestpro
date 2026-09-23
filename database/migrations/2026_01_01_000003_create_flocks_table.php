<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('house_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('batch_no')->unique();
            $table->enum('bird_type', ['layer', 'broiler', 'cockerel', 'turkey', 'duck', 'guinea_fowl', 'other'])->default('layer');
            $table->string('breed')->nullable();
            $table->unsignedInteger('initial_quantity');
            $table->unsignedInteger('current_quantity');
            $table->enum('source', ['purchase', 'hatched', 'gifted', 'transferred'])->default('purchase');
            $table->string('source_name')->nullable();
            $table->date('arrival_date');
            $table->unsignedInteger('age_weeks')->default(0);
            $table->decimal('purchase_cost', 12, 2)->default(0);
            $table->enum('status', ['active', 'sold', 'culled', 'completed'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flocks');
    }
};
