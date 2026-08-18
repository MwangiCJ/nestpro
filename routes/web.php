<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EggProductionController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FeedConsumptionController;
use App\Http\Controllers\FeedPurchaseController;
use App\Http\Controllers\FlockController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\HousingController;
use App\Http\Controllers\LabourController;
use App\Http\Controllers\MortalityController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;

// Redirect root to dashboard (or login)
Route::get('/', fn() => redirect()->route('dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Farm Setup
    Route::get('/farm', [FarmController::class, 'index'])->name('farm.index');
    Route::get('/farm/create', [FarmController::class, 'create'])->name('farm.create');
    Route::post('/farm', [FarmController::class, 'store'])->name('farm.store');
    Route::get('/farm/{farm}/edit', [FarmController::class, 'edit'])->name('farm.edit');
    Route::put('/farm/{farm}', [FarmController::class, 'update'])->name('farm.update');

    // Flock Register
    Route::resource('flocks', FlockController::class);

    // Egg Production
    Route::resource('egg-production', EggProductionController::class);

    // Sales
    Route::resource('sales', SaleController::class);

    // Feed Expense (purchases)
    Route::resource('feed-expenses', FeedPurchaseController::class);

    // Feed Consumption
    Route::resource('feed-consumption', FeedConsumptionController::class);

    // Vet & Health
    Route::resource('health', HealthController::class);

    // Mortality Log
    Route::resource('mortality', MortalityController::class);

    // Housing
    Route::resource('housing', HousingController::class);

    // Equipment
    Route::resource('equipment', EquipmentController::class);

    // Labour & Operations
    Route::resource('labour', LabourController::class);

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
