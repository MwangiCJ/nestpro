<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MortalityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'flock_id', 'log_date', 'quantity', 'cause',
        'specific_cause', 'disposal_method', 'notes',
    ];

    protected $casts = [
        'log_date' => 'date',
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
