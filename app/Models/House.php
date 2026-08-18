<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'name', 'house_type', 'capacity',
        'length_m', 'width_m', 'status', 'notes',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function flocks()
    {
        return $this->hasMany(Flock::class);
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class);
    }

    public function getAreaAttribute(): ?float
    {
        if ($this->length_m && $this->width_m) {
            return round($this->length_m * $this->width_m, 2);
        }
        return null;
    }

    public function getCurrentOccupancyAttribute(): int
    {
        return $this->flocks()->where('status', 'active')->sum('current_quantity');
    }
}
