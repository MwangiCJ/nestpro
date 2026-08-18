<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('labour_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->string('worker_name');
            $table->string('worker_role')->nullable(); // farm manager, labourer, driver
            $table->string('task');
            $table->date('work_date');
            $table->decimal('hours_worked', 5, 2)->default(0);
            $table->decimal('rate_per_hour', 10, 2)->default(0);
            $table->decimal('total_pay', 12, 2)->default(0);
            $table->enum('payment_status', ['paid', 'pending'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('labour_records');
    }
};
