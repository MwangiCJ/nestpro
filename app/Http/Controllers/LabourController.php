<?php

namespace App\Http\Controllers;

use App\Models\LabourRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LabourController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(Request $request): Response
    {
        $farmId = $this->farmId();
        $query = LabourRecord::where('farm_id', $farmId);

        if ($request->filled('from')) $query->where('work_date', '>=', $request->from);
        if ($request->filled('to'))   $query->where('work_date', '<=', $request->to);
        if ($request->filled('payment_status')) $query->where('payment_status', $request->payment_status);

        $records = $query->orderByDesc('work_date')->paginate(20)->withQueryString();

        $monthTotal = LabourRecord::where('farm_id', $farmId)
            ->whereMonth('work_date', now()->month)
            ->whereYear('work_date', now()->year)
            ->sum('total_pay');

        $pendingPay = LabourRecord::where('farm_id', $farmId)
            ->where('payment_status', 'pending')
            ->sum('total_pay');

        return Inertia::render('Labour/Index', [
            'records'    => $records,
            'filters'    => $request->only(['from', 'to', 'payment_status']),
            'monthTotal' => $monthTotal,
            'pendingPay' => $pendingPay,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Labour/Create');
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'worker_name'    => 'required|string|max:255',
            'worker_role'    => 'nullable|string|max:255',
            'task'           => 'required|string|max:255',
            'work_date'      => 'required|date',
            'hours_worked'   => 'required|numeric|min:0',
            'rate_per_hour'  => 'required|numeric|min:0',
            'total_pay'      => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid,pending',
            'notes'          => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;
        LabourRecord::create($validated);
        return redirect()->route('labour.index')->with('success', 'Labour record added.');
    }

    public function edit(LabourRecord $labour): Response
    {
        return Inertia::render('Labour/Edit', ['record' => $labour]);
    }

    public function update(Request $request, LabourRecord $labour)
    {
        $validated = $request->validate([
            'worker_name'    => 'required|string|max:255',
            'worker_role'    => 'nullable|string|max:255',
            'task'           => 'required|string|max:255',
            'work_date'      => 'required|date',
            'hours_worked'   => 'required|numeric|min:0',
            'rate_per_hour'  => 'required|numeric|min:0',
            'total_pay'      => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid,pending',
            'notes'          => 'nullable|string',
        ]);

        $labour->update($validated);
        return redirect()->route('labour.index')->with('success', 'Record updated.');
    }

    public function destroy(LabourRecord $labour)
    {
        $labour->delete();
        return back()->with('success', 'Record deleted.');
    }
}
