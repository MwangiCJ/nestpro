<?php

namespace App\Http\Controllers;

use App\Models\Flock;
use App\Models\HealthRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HealthController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(Request $request): Response
    {
        $farmId = $this->farmId();
        $query = HealthRecord::where('farm_id', $farmId)->with('flock');

        if ($request->filled('flock_id')) $query->where('flock_id', $request->flock_id);
        if ($request->filled('record_type')) $query->where('record_type', $request->record_type);
        if ($request->filled('from')) $query->where('record_date', '>=', $request->from);
        if ($request->filled('to'))   $query->where('record_date', '<=', $request->to);

        $records = $query->orderByDesc('record_date')->paginate(20)->withQueryString();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name']);

        $upcoming = HealthRecord::where('farm_id', $farmId)
            ->whereBetween('next_due_date', [today(), today()->addDays(14)])
            ->with('flock')
            ->orderBy('next_due_date')
            ->get();

        $monthCost = HealthRecord::where('farm_id', $farmId)
            ->whereMonth('record_date', now()->month)
            ->whereYear('record_date', now()->year)
            ->sum('cost');

        return Inertia::render('Health/Index', [
            'records'   => $records,
            'flocks'    => $flocks,
            'upcoming'  => $upcoming,
            'filters'   => $request->only(['flock_id', 'record_type', 'from', 'to']),
            'monthCost' => $monthCost,
        ]);
    }

    public function create(): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name']);
        return Inertia::render('Health/Create', ['flocks' => $flocks]);
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'flock_id'             => 'required|exists:flocks,id',
            'record_date'          => 'required|date',
            'record_type'          => 'required|in:vaccination,medication,checkup,deworming,treatment,other',
            'disease_condition'    => 'nullable|string|max:255',
            'vaccine_drug_name'    => 'nullable|string|max:255',
            'dosage'               => 'nullable|string|max:255',
            'administration_route' => 'nullable|string|max:100',
            'birds_affected'       => 'nullable|integer|min:1',
            'vet_name'             => 'nullable|string|max:255',
            'cost'                 => 'nullable|numeric|min:0',
            'next_due_date'        => 'nullable|date|after:record_date',
            'status'               => 'required|in:completed,scheduled,overdue',
            'notes'                => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;
        HealthRecord::create($validated);
        return redirect()->route('health.index')->with('success', 'Health record added.');
    }

    public function edit(HealthRecord $health): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->where('status', 'active')->get(['id', 'name']);
        return Inertia::render('Health/Edit', ['record' => $health->load('flock'), 'flocks' => $flocks]);
    }

    public function update(Request $request, HealthRecord $health)
    {
        $validated = $request->validate([
            'flock_id'             => 'required|exists:flocks,id',
            'record_date'          => 'required|date',
            'record_type'          => 'required|in:vaccination,medication,checkup,deworming,treatment,other',
            'disease_condition'    => 'nullable|string|max:255',
            'vaccine_drug_name'    => 'nullable|string|max:255',
            'dosage'               => 'nullable|string|max:255',
            'administration_route' => 'nullable|string|max:100',
            'birds_affected'       => 'nullable|integer|min:1',
            'vet_name'             => 'nullable|string|max:255',
            'cost'                 => 'nullable|numeric|min:0',
            'next_due_date'        => 'nullable|date',
            'status'               => 'required|in:completed,scheduled,overdue',
            'notes'                => 'nullable|string',
        ]);

        $health->update($validated);
        return redirect()->route('health.index')->with('success', 'Record updated.');
    }

    public function destroy(HealthRecord $health)
    {
        $health->delete();
        return back()->with('success', 'Record deleted.');
    }
}
