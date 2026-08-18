<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('house_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->enum('category', [
                'feeder', 'drinker', 'heater', 'incubator', 'hatcher',
                'cage', 'egg_tray', 'weighing_scale', 'sprayer', 'generator', 'vehicle', 'other'
            ])->default('other');
            $table->unsignedInteger('quantity')->default(1);
            $table->enum('condition', ['good', 'fair', 'poor', 'damaged'])->default('good');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_cost', 12, 2)->nullable();
            $table->string('supplier')->nullable();
            $table->date('last_maintenance_date')->nullable();
            $table->date('next_maintenance_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
