<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->date('purchase_date');
            $table->string('feed_type'); // e.g. layers mash, growers, broiler starter
            $table->string('brand')->nullable();
            $table->decimal('quantity_kg', 12, 2);
            $table->decimal('unit_price', 12, 2); // per kg
            $table->decimal('total_cost', 12, 2);
            $table->string('supplier')->nullable();
            $table->string('invoice_no')->nullable();
            $table->enum('payment_status', ['paid', 'pending', 'partial'])->default('paid');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_purchases');
    }
};
