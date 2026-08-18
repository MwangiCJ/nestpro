<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\Flock;
use App\Models\House;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@nestpro.test'],
            [
                'name' => 'Demo Farmer',
                'password' => Hash::make('password'),
            ]
        );

        $farm = $user->farms()->firstOrCreate(
            ['name' => 'Green Valley Poultry'],
            [
                'owner_name' => 'Demo Farmer',
                'location' => 'Accra',
                'address' => 'Plot 14, Agbogba Road',
                'phone' => '+233 244 000 000',
                'email' => 'farm@nestpro.test',
                'established_date' => now()->subYears(3),
                'farm_type' => 'layer',
                'notes' => 'Demo poultry operation for staff training and onboarding.',
                'currency' => 'GHS',
            ]
        );

        $house = $farm->houses()->firstOrCreate(
            ['name' => 'Layer House 1'],
            [
                'house_type' => 'battery_cage',
                'capacity' => 2000,
                'length_m' => 24,
                'width_m' => 12,
                'status' => 'active',
                'notes' => 'Primary egg production housing.',
            ]
        );

        Flock::firstOrCreate(
            ['farm_id' => $farm->id, 'batch_no' => 'LAYER-001'],
            [
                'house_id' => $house->id,
                'name' => 'Layer Batch A',
                'bird_type' => 'layer',
                'breed' => 'Isa Brown',
                'initial_quantity' => 1500,
                'current_quantity' => 1425,
                'source' => 'hatchery',
                'source_name' => 'Local Hatchery Ltd.',
                'arrival_date' => now()->subMonths(5),
                'age_weeks' => 24,
                'purchase_cost' => 0,
                'status' => 'active',
                'notes' => 'Main production flock.',
            ]
        );

        $broilerHouse = $farm->houses()->firstOrCreate(
            ['name' => 'Broiler House 1'],
            [
                'house_type' => 'deep_litter',
                'capacity' => 1000,
                'length_m' => 18,
                'width_m' => 10,
                'status' => 'active',
                'notes' => 'Supplementary meat production house.',
            ]
        );

        Flock::firstOrCreate(
            ['farm_id' => $farm->id, 'batch_no' => 'BROILER-001'],
            [
                'house_id' => $broilerHouse->id,
                'name' => 'Broiler Batch A',
                'bird_type' => 'broiler',
                'breed' => 'Cobb 500',
                'initial_quantity' => 900,
                'current_quantity' => 820,
                'source' => 'purchase',
                'source_name' => 'Premium Poultry',
                'arrival_date' => now()->subWeeks(4),
                'age_weeks' => 5,
                'purchase_cost' => 0,
                'status' => 'active',
                'notes' => 'Meat birds entering finishing stage.',
            ]
        );
    }
}
