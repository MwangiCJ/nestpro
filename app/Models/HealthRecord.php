<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'flock_id', 'record_date', 'record_type',
        'disease_condition', 'vaccine_drug_name', 'dosage',
        'administration_route', 'birds_affected', 'vet_name',
        'cost', 'next_due_date', 'status', 'notes',
    ];

    protected $casts = [
        'record_date' => 'date',
        'next_due_date' => 'date',
        'cost' => 'decimal:2',
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
