<?php

namespace App\Http\Controllers;

use App\Models\Flock;
use App\Models\MortalityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MortalityController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(Request $request): Response
    {
        $farmId = $this->farmId();
        $query = MortalityLog::where('farm_id', $farmId)->with('flock');

        if ($request->filled('flock_id')) $query->where('flock_id', $request->flock_id);
        if ($request->filled('cause'))    $query->where('cause', $request->cause);
        if ($request->filled('from'))     $query->where('log_date', '>=', $request->from);
        if ($request->filled('to'))       $query->where('log_date', '<=', $request->to);

        $logs = $query->orderByDesc('log_date')->paginate(20)->withQueryString();
        $flocks = Flock::where('farm_id', $farmId)->get(['id', 'name']);

        $monthTotal = MortalityLog::where('farm_id', $farmId)
            ->whereMonth('log_date', now()->month)
            ->whereYear('log_date', now()->year)
            ->sum('quantity');

        return Inertia::render('Mortality/Index', [
            'logs'       => $logs,
            'flocks'     => $flocks,
            'filters'    => $request->only(['flock_id', 'cause', 'from', 'to']),
            'monthTotal' => $monthTotal,
        ]);
    }

    public function create(): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name', 'current_quantity']);
        return Inertia::render('Mortality/Create', ['flocks' => $flocks]);
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'flock_id'        => 'required|exists:flocks,id',
            'log_date'        => 'required|date',
            'quantity'        => 'required|integer|min:1',
            'cause'           => 'required|in:disease,injury,unknown,predator,heat_stress,cold_stress,culled,suffocation,other',
            'specific_cause'  => 'nullable|string|max:255',
            'disposal_method' => 'nullable|in:buried,incinerated,composted,other',
            'notes'           => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;

        // Reduce flock current_quantity
        $flock = Flock::findOrFail($validated['flock_id']);
        $flock->decrement('current_quantity', $validated['quantity']);

        MortalityLog::create($validated);
        return redirect()->route('mortality.index')->with('success', 'Mortality recorded. Flock count updated.');
    }

    public function edit(MortalityLog $mortality): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->get(['id', 'name']);
        return Inertia::render('Mortality/Edit', ['log' => $mortality->load('flock'), 'flocks' => $flocks]);
    }

    public function update(Request $request, MortalityLog $mortality)
    {
        $validated = $request->validate([
            'flock_id'        => 'required|exists:flocks,id',
            'log_date'        => 'required|date',
            'quantity'        => 'required|integer|min:1',
            'cause'           => 'required|in:disease,injury,unknown,predator,heat_stress,cold_stress,culled,suffocation,other',
            'specific_cause'  => 'nullable|string|max:255',
            'disposal_method' => 'nullable|in:buried,incinerated,composted,other',
            'notes'           => 'nullable|string',
        ]);

        // Adjust flock quantity for difference
        $diff = $validated['quantity'] - $mortality->quantity;
        if ($diff !== 0) {
            $flock = Flock::findOrFail($validated['flock_id']);
            $flock->decrement('current_quantity', $diff);
        }

        $mortality->update($validated);
        return redirect()->route('mortality.index')->with('success', 'Record updated.');
    }

    public function destroy(MortalityLog $mortality)
    {
        // Restore flock count
        $flock = Flock::find($mortality->flock_id);
        if ($flock) $flock->increment('current_quantity', $mortality->quantity);
        $mortality->delete();
        return back()->with('success', 'Record deleted. Flock count restored.');
    }
}
