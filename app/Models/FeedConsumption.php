<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedConsumption extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'flock_id', 'consumption_date', 'feed_type',
        'brand', 'quantity_kg', 'feed_per_bird', 'recorded_by', 'notes',
    ];

    protected $casts = [
        'consumption_date' => 'date',
        'quantity_kg' => 'decimal:2',
        'feed_per_bird' => 'decimal:4',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function flock()
    {
        return $this->belongsTo(Flock::class);
    }
}
