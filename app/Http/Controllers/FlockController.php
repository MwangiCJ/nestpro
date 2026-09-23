<?php

namespace App\Http\Controllers;

use App\Models\Flock;
use App\Models\House;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlockController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)
            ->with('house')
            ->withCount(['mortalityLogs as total_deaths' => fn($q) => $q->selectRaw('SUM(quantity)')])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Flock/Index', ['flocks' => $flocks]);
    }

    public function create(): Response
    {
        $farmId = $this->farmId();
        $houses = House::where('farm_id', $farmId)->where('status', 'active')->get();
        return Inertia::render('Flock/Create', ['houses' => $houses]);
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'house_id'         => 'nullable|exists:houses,id',
            'name'             => 'required|string|max:255',
            'batch_no'         => 'required|string|unique:flocks,batch_no',
            'bird_type'        => 'required|in:layer,broiler,cockerel,turkey,duck,guinea_fowl,other',
            'breed'            => 'nullable|string|max:255',
            'initial_quantity' => 'required|integer|min:1',
            'source'           => 'required|in:purchase,hatched,gifted,transferred',
            'source_name'      => 'nullable|string|max:255',
            'arrival_date'     => 'required|date',
            'age_weeks'        => 'nullable|integer|min:0',
            'purchase_cost'    => 'nullable|numeric|min:0',
            'notes'            => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;
        $validated['current_quantity'] = $validated['initial_quantity'];
        $validated['status'] = 'active';

        Flock::create($validated);
        return redirect()->route('flocks.index')->with('success', 'Flock registered successfully.');
    }

    public function show(Flock $flock): Response
    {
        $flock->load('house', 'eggProductions', 'mortalityLogs', 'healthRecords', 'feedConsumptions');
        $flock->loadSum('mortalityLogs as total_deaths', 'quantity');

        $recentEggs = $flock->eggProductions()->orderByDesc('production_date')->limit(10)->get();
        $recentMortality = $flock->mortalityLogs()->orderByDesc('log_date')->limit(5)->get();
        $upcomingHealth = $flock->healthRecords()
            ->where('next_due_date', '>=', today())
            ->orderBy('next_due_date')
            ->limit(5)
            ->get();

        return Inertia::render('Flock/Show', [
            'flock'           => $flock,
            'recentEggs'      => $recentEggs,
            'recentMortality' => $recentMortality,
            'upcomingHealth'  => $upcomingHealth,
        ]);
    }

    public function edit(Flock $flock): Response
    {
        $farmId = $this->farmId();
        $houses = House::where('farm_id', $farmId)->where('status', 'active')->get();
        return Inertia::render('Flock/Edit', ['flock' => $flock, 'houses' => $houses]);
    }

    public function update(Request $request, Flock $flock)
    {
        $validated = $request->validate([
            'house_id'         => 'nullable|exists:houses,id',
            'name'             => 'required|string|max:255',
            'bird_type'        => 'required|in:layer,broiler,cockerel,turkey,duck,guinea_fowl,other',
            'breed'            => 'nullable|string|max:255',
            'current_quantity' => 'required|integer|min:0',
            'status'           => 'required|in:active,sold,culled,completed',
            'source'           => 'required|in:purchase,hatched,gifted,transferred',
            'age_weeks'        => 'nullable|integer|min:0',
            'notes'            => 'nullable|string',
        ]);

        $flock->update($validated);
        return redirect()->route('flocks.index')->with('success', 'Flock updated successfully.');
    }

    public function destroy(Flock $flock)
    {
        $flock->delete();
        return redirect()->route('flocks.index')->with('success', 'Flock removed.');
    }
}
