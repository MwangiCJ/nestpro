<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EggProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'flock_id', 'production_date', 'total_eggs',
        'whole_eggs', 'broken_eggs', 'small_eggs', 'soiled_eggs',
        'collected_by', 'production_rate', 'notes',
    ];

    protected $casts = [
        'production_date' => 'date',
        'production_rate' => 'decimal:2',
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
