<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('flock_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('sale_type', ['egg', 'meat', 'live_bird', 'manure', 'other']);
            $table->date('sale_date');
            $table->decimal('quantity', 12, 2);
            $table->string('unit')->default('pieces'); // pieces, kg, bags, trays
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total_amount', 12, 2);
            $table->string('buyer_name')->nullable();
            $table->string('buyer_phone')->nullable();
            $table->enum('payment_status', ['paid', 'pending', 'partial'])->default('paid');
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->string('receipt_no')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
