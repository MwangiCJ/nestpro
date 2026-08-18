<?php

namespace App\Http\Controllers;

use App\Models\EggProduction;
use App\Models\Flock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EggProductionController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(Request $request): Response
    {
        $farmId = $this->farmId();
        $query = EggProduction::where('farm_id', $farmId)->with('flock');

        if ($request->filled('flock_id')) {
            $query->where('flock_id', $request->flock_id);
        }
        if ($request->filled('from')) {
            $query->where('production_date', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->where('production_date', '<=', $request->to);
        }

        $logs = $query->orderByDesc('production_date')->paginate(20)->withQueryString();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name']);

        // Monthly summary
        $monthTotal = EggProduction::where('farm_id', $farmId)
            ->whereMonth('production_date', now()->month)
            ->whereYear('production_date', now()->year)
            ->sum('total_eggs');

        return Inertia::render('EggProduction/Index', [
            'logs'       => $logs,
            'flocks'     => $flocks,
            'filters'    => $request->only(['flock_id', 'from', 'to']),
            'monthTotal' => $monthTotal,
        ]);
    }

    public function create(): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name', 'current_quantity']);
        return Inertia::render('EggProduction/Create', ['flocks' => $flocks]);
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'flock_id'        => 'required|exists:flocks,id',
            'production_date' => 'required|date',
            'total_eggs'      => 'required|integer|min:0',
            'whole_eggs'      => 'required|integer|min:0',
            'broken_eggs'     => 'nullable|integer|min:0',
            'small_eggs'      => 'nullable|integer|min:0',
            'soiled_eggs'     => 'nullable|integer|min:0',
            'collected_by'    => 'nullable|string|max:255',
            'notes'           => 'nullable|string',
        ]);

        $flock = Flock::findOrFail($validated['flock_id']);
        if ($flock->current_quantity > 0) {
            $validated['production_rate'] = round(($validated['total_eggs'] / $flock->current_quantity) * 100, 2);
        }
        $validated['farm_id'] = $farmId;

        EggProduction::create($validated);
        return redirect()->route('egg-production.index')->with('success', 'Egg production recorded.');
    }

    public function edit(EggProduction $eggProduction): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name', 'current_quantity']);
        return Inertia::render('EggProduction/Edit', ['record' => $eggProduction->load('flock'), 'flocks' => $flocks]);
    }

    public function update(Request $request, EggProduction $eggProduction)
    {
        $validated = $request->validate([
            'flock_id'        => 'required|exists:flocks,id',
            'production_date' => 'required|date',
            'total_eggs'      => 'required|integer|min:0',
            'whole_eggs'      => 'required|integer|min:0',
            'broken_eggs'     => 'nullable|integer|min:0',
            'small_eggs'      => 'nullable|integer|min:0',
            'soiled_eggs'     => 'nullable|integer|min:0',
            'collected_by'    => 'nullable|string|max:255',
            'notes'           => 'nullable|string',
        ]);

        $flock = Flock::findOrFail($validated['flock_id']);
        if ($flock->current_quantity > 0) {
            $validated['production_rate'] = round(($validated['total_eggs'] / $flock->current_quantity) * 100, 2);
        }

        $eggProduction->update($validated);
        return redirect()->route('egg-production.index')->with('success', 'Record updated.');
    }

    public function destroy(EggProduction $eggProduction)
    {
        $eggProduction->delete();
        return back()->with('success', 'Record deleted.');
    }
}
