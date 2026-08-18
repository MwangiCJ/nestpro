<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabourRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_id', 'worker_name', 'worker_role', 'task',
        'work_date', 'hours_worked', 'rate_per_hour', 'total_pay',
        'payment_status', 'notes',
    ];

    protected $casts = [
        'work_date' => 'date',
        'hours_worked' => 'decimal:2',
        'rate_per_hour' => 'decimal:2',
        'total_pay' => 'decimal:2',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
