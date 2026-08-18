<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('owner_name');
            $table->string('location')->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->date('established_date')->nullable();
            $table->enum('farm_type', ['layer', 'broiler', 'dual_purpose', 'turkey', 'duck', 'mixed'])->default('mixed');
            $table->text('notes')->nullable();
            $table->string('logo')->nullable();
            $table->string('currency', 10)->default('GHS');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farms');
    }
};
