<?php

namespace App\Http\Controllers;

use App\Models\FeedConsumption;
use App\Models\Flock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedConsumptionController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(Request $request): Response
    {
        $farmId = $this->farmId();
        $query = FeedConsumption::where('farm_id', $farmId)->with('flock');

        if ($request->filled('flock_id')) $query->where('flock_id', $request->flock_id);
        if ($request->filled('from')) $query->where('consumption_date', '>=', $request->from);
        if ($request->filled('to'))   $query->where('consumption_date', '<=', $request->to);

        $logs = $query->orderByDesc('consumption_date')->paginate(20)->withQueryString();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name']);

        $monthTotal = FeedConsumption::where('farm_id', $farmId)
            ->whereMonth('consumption_date', now()->month)
            ->whereYear('consumption_date', now()->year)
            ->sum('quantity_kg');

        return Inertia::render('FeedConsumption/Index', [
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
        return Inertia::render('FeedConsumption/Create', ['flocks' => $flocks]);
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'flock_id'         => 'required|exists:flocks,id',
            'consumption_date' => 'required|date',
            'feed_type'        => 'required|string|max:255',
            'brand'            => 'nullable|string|max:255',
            'quantity_kg'      => 'required|numeric|min:0.01',
            'recorded_by'      => 'nullable|string|max:255',
            'notes'            => 'nullable|string',
        ]);

        $flock = Flock::findOrFail($validated['flock_id']);
        if ($flock->current_quantity > 0) {
            $validated['feed_per_bird'] = round($validated['quantity_kg'] / $flock->current_quantity, 4);
        }
        $validated['farm_id'] = $farmId;

        FeedConsumption::create($validated);
        return redirect()->route('feed-consumption.index')->with('success', 'Feed consumption recorded.');
    }

    public function edit(FeedConsumption $feedConsumption): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name', 'current_quantity']);
        return Inertia::render('FeedConsumption/Edit', ['record' => $feedConsumption->load('flock'), 'flocks' => $flocks]);
    }

    public function update(Request $request, FeedConsumption $feedConsumption)
    {
        $validated = $request->validate([
            'flock_id'         => 'required|exists:flocks,id',
            'consumption_date' => 'required|date',
            'feed_type'        => 'required|string|max:255',
            'brand'            => 'nullable|string|max:255',
            'quantity_kg'      => 'required|numeric|min:0.01',
            'recorded_by'      => 'nullable|string|max:255',
            'notes'            => 'nullable|string',
        ]);

        $flock = Flock::findOrFail($validated['flock_id']);
        if ($flock->current_quantity > 0) {
            $validated['feed_per_bird'] = round($validated['quantity_kg'] / $flock->current_quantity, 4);
        }

        $feedConsumption->update($validated);
        return redirect()->route('feed-consumption.index')->with('success', 'Record updated.');
    }

    public function destroy(FeedConsumption $feedConsumption)
    {
        $feedConsumption->delete();
        return back()->with('success', 'Record deleted.');
    }
}
