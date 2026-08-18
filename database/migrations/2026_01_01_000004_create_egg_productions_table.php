<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('egg_productions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('flock_id')->constrained()->onDelete('cascade');
            $table->date('production_date');
            $table->unsignedInteger('total_eggs');
            $table->unsignedInteger('whole_eggs');
            $table->unsignedInteger('broken_eggs')->default(0);
            $table->unsignedInteger('small_eggs')->default(0);
            $table->unsignedInteger('soiled_eggs')->default(0);
            $table->string('collected_by')->nullable();
            $table->decimal('production_rate', 5, 2)->nullable()->comment('Percentage');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('egg_productions');
    }
};
