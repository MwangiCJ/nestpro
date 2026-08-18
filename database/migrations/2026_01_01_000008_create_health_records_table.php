<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('flock_id')->constrained()->onDelete('cascade');
            $table->date('record_date');
            $table->enum('record_type', ['vaccination', 'medication', 'checkup', 'deworming', 'treatment', 'other']);
            $table->string('disease_condition')->nullable();
            $table->string('vaccine_drug_name')->nullable();
            $table->string('dosage')->nullable();
            $table->string('administration_route')->nullable(); // oral, injection, water, feed
            $table->unsignedInteger('birds_affected')->nullable();
            $table->string('vet_name')->nullable();
            $table->decimal('cost', 12, 2)->default(0);
            $table->date('next_due_date')->nullable();
            $table->enum('status', ['completed', 'scheduled', 'overdue'])->default('completed');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_records');
    }
};
