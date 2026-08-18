<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedPurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'purchase_date', 'feed_type', 'brand', 'quantity_kg',
        'unit_price', 'total_cost', 'supplier', 'invoice_no', 'payment_status', 'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'quantity_kg' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
