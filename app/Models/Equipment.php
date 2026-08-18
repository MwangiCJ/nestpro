<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'house_id', 'name', 'category', 'quantity',
        'condition', 'purchase_date', 'purchase_cost', 'supplier',
        'last_maintenance_date', 'next_maintenance_date', 'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'last_maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
        'purchase_cost' => 'decimal:2',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function house()
    {
        return $this->belongsTo(House::class);
    }
}
