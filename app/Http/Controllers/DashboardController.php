<?php

namespace App\Http\Controllers;

use App\Models\EggProduction;
use App\Models\Farm;
use App\Models\FeedConsumption;
use App\Models\FeedPurchase;
use App\Models\Flock;
use App\Models\HealthRecord;
use App\Models\LabourRecord;
use App\Models\MortalityLog;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $farm = $user->farms()->first();

        if (!$farm) {
            return Inertia::render('Dashboard/Index', [
                'farm' => null,
                'stats' => null,
            ]);
        }

        $farmId = $farm->id;
        $thisMonth = now()->month;
        $thisYear = now()->year;

        // Core stats
        $totalActiveBirds = Flock::where('farm_id', $farmId)
            ->where('status', 'active')
            ->sum('current_quantity');

        $activeFlocks = Flock::where('farm_id', $farmId)
            ->where('status', 'active')
            ->count();

        // Today's eggs
        $todayEggs = EggProduction::where('farm_id', $farmId)
            ->whereDate('production_date', today())
            ->sum('total_eggs');

        // This month's eggs
        $monthEggs = EggProduction::where('farm_id', $farmId)
            ->whereMonth('production_date', $thisMonth)
            ->whereYear('production_date', $thisYear)
            ->sum('total_eggs');

        // Sales this month
        $monthlySales = Sale::where('farm_id', $farmId)
            ->whereMonth('sale_date', $thisMonth)
            ->whereYear('sale_date', $thisYear)
            ->sum('total_amount');

        // Feed cost this month
        $monthlyFeedCost = FeedPurchase::where('farm_id', $farmId)
            ->whereMonth('purchase_date', $thisMonth)
            ->whereYear('purchase_date', $thisYear)
            ->sum('total_cost');

        // Health costs this month
        $monthlyHealthCost = HealthRecord::where('farm_id', $farmId)
            ->whereMonth('record_date', $thisMonth)
            ->whereYear('record_date', $thisYear)
            ->sum('cost');

        // Labour costs this month
        $monthlyLabourCost = LabourRecord::where('farm_id', $farmId)
            ->whereMonth('work_date', $thisMonth)
            ->whereYear('work_date', $thisYear)
            ->sum('total_pay');

        $monthlyExpenses = $monthlyFeedCost + $monthlyHealthCost + $monthlyLabourCost;
        $netProfit = $monthlySales - $monthlyExpenses;

        // Mortality this month
        $monthlyMortality = MortalityLog::where('farm_id', $farmId)
            ->whereMonth('log_date', $thisMonth)
            ->whereYear('log_date', $thisYear)
            ->sum('quantity');

        // Upcoming health schedules (next 7 days)
        $upcomingHealth = HealthRecord::where('farm_id', $farmId)
            ->whereBetween('next_due_date', [today(), today()->addDays(7)])
            ->with('flock')
            ->orderBy('next_due_date')
            ->limit(5)
            ->get();

        // Recent activity (last 5 egg productions)
        $recentEggLogs = EggProduction::where('farm_id', $farmId)
            ->with('flock')
            ->orderByDesc('production_date')
            ->limit(5)
            ->get();

        // Egg production last 7 days (chart data)
        $eggChartData = EggProduction::where('farm_id', $farmId)
            ->where('production_date', '>=', today()->subDays(6))
            ->selectRaw('production_date, SUM(total_eggs) as eggs')
            ->groupBy('production_date')
            ->orderBy('production_date')
            ->get()
            ->map(fn($r) => [
                'date' => $r->production_date->format('D'),
                'eggs' => $r->eggs,
            ]);

        // Sales breakdown by type this month
        $salesByType = Sale::where('farm_id', $farmId)
            ->whereMonth('sale_date', $thisMonth)
            ->whereYear('sale_date', $thisYear)
            ->selectRaw('sale_type, SUM(total_amount) as total')
            ->groupBy('sale_type')
            ->get()
            ->map(fn($r) => ['type' => ucfirst(str_replace('_', ' ', $r->sale_type)), 'total' => $r->total]);

        // Active flocks list
        $flocks = Flock::where('farm_id', $farmId)
            ->where('status', 'active')
            ->select('id', 'name', 'bird_type', 'current_quantity', 'arrival_date')
            ->get();

        return Inertia::render('Dashboard/Index', [
            'farm' => $farm,
            'stats' => [
                'total_active_birds' => $totalActiveBirds,
                'active_flocks' => $activeFlocks,
                'today_eggs' => $todayEggs,
                'month_eggs' => $monthEggs,
                'monthly_sales' => $monthlySales,
                'monthly_expenses' => $monthlyExpenses,
                'monthly_feed_cost' => $monthlyFeedCost,
                'monthly_health_cost' => $monthlyHealthCost,
                'monthly_labour_cost' => $monthlyLabourCost,
                'net_profit' => $netProfit,
                'monthly_mortality' => $monthlyMortality,
            ],
            'upcomingHealth' => $upcomingHealth,
            'recentEggLogs' => $recentEggLogs,
            'eggChartData' => $eggChartData,
            'salesByType' => $salesByType,
            'flocks' => $flocks,
        ]);
    }
}
