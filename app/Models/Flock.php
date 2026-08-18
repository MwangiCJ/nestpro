<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flock extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'house_id', 'name', 'batch_no', 'bird_type', 'breed',
        'initial_quantity', 'current_quantity', 'source', 'source_name',
        'arrival_date', 'age_weeks', 'purchase_cost', 'status', 'notes',
    ];

    protected $casts = [
        'arrival_date' => 'date',
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

    public function eggProductions()
    {
        return $this->hasMany(EggProduction::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function feedConsumptions()
    {
        return $this->hasMany(FeedConsumption::class);
    }

    public function healthRecords()
    {
        return $this->hasMany(HealthRecord::class);
    }

    public function mortalityLogs()
    {
        return $this->hasMany(MortalityLog::class);
    }

    public function getMortalityRateAttribute(): float
    {
        if ($this->initial_quantity === 0) return 0;
        $deaths = $this->mortalityLogs()->sum('quantity');
        return round(($deaths / $this->initial_quantity) * 100, 2);
    }

    public function getTodayEggsAttribute(): int
    {
        return $this->eggProductions()
            ->whereDate('production_date', today())
            ->sum('total_eggs');
    }

    public function getAgeWeeksCurrentAttribute(): int
    {
        return $this->arrival_date
            ? (int) $this->arrival_date->diffInWeeks(now())
            : $this->age_weeks;
    }
}
