<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'owner_name', 'location', 'address',
        'phone', 'email', 'established_date', 'farm_type',
        'notes', 'logo', 'currency',
    ];

    protected $casts = [
        'established_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flocks()
    {
        return $this->hasMany(Flock::class);
    }

    public function houses()
    {
        return $this->hasMany(House::class);
    }

    public function eggProductions()
    {
        return $this->hasMany(EggProduction::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function feedPurchases()
    {
        return $this->hasMany(FeedPurchase::class);
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

    public function equipment()
    {
        return $this->hasMany(Equipment::class);
    }

    public function labourRecords()
    {
        return $this->hasMany(LabourRecord::class);
    }

    // Helper: total active birds
    public function getTotalActiveBirdsAttribute(): int
    {
        return $this->flocks()->where('status', 'active')->sum('current_quantity');
    }

    // Helper: total revenue this month
    public function getMonthlyRevenueAttribute(): float
    {
        return $this->sales()
            ->whereMonth('sale_date', now()->month)
            ->whereYear('sale_date', now()->year)
            ->sum('total_amount');
    }
}
