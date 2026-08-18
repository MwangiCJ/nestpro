<?php

namespace App\Http\Controllers;

use App\Models\FeedPurchase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedPurchaseController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(Request $request): Response
    {
        $farmId = $this->farmId();
        $query = FeedPurchase::where('farm_id', $farmId);

        if ($request->filled('from')) $query->where('purchase_date', '>=', $request->from);
        if ($request->filled('to'))   $query->where('purchase_date', '<=', $request->to);

        $purchases = $query->orderByDesc('purchase_date')->paginate(20)->withQueryString();

        $monthTotal = FeedPurchase::where('farm_id', $farmId)
            ->whereMonth('purchase_date', now()->month)
            ->whereYear('purchase_date', now()->year)
            ->sum('total_cost');

        return Inertia::render('FeedExpense/Index', [
            'purchases'  => $purchases,
            'filters'    => $request->only(['from', 'to']),
            'monthTotal' => $monthTotal,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('FeedExpense/Create');
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'purchase_date'  => 'required|date',
            'feed_type'      => 'required|string|max:255',
            'brand'          => 'nullable|string|max:255',
            'quantity_kg'    => 'required|numeric|min:0.01',
            'unit_price'     => 'required|numeric|min:0',
            'total_cost'     => 'required|numeric|min:0',
            'supplier'       => 'nullable|string|max:255',
            'invoice_no'     => 'nullable|string|max:100',
            'payment_status' => 'required|in:paid,pending,partial',
            'notes'          => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;
        FeedPurchase::create($validated);
        return redirect()->route('feed-expenses.index')->with('success', 'Feed purchase recorded.');
    }

    public function edit(FeedPurchase $feedExpense): Response
    {
        return Inertia::render('FeedExpense/Edit', ['purchase' => $feedExpense]);
    }

    public function update(Request $request, FeedPurchase $feedExpense)
    {
        $validated = $request->validate([
            'purchase_date'  => 'required|date',
            'feed_type'      => 'required|string|max:255',
            'brand'          => 'nullable|string|max:255',
            'quantity_kg'    => 'required|numeric|min:0.01',
            'unit_price'     => 'required|numeric|min:0',
            'total_cost'     => 'required|numeric|min:0',
            'supplier'       => 'nullable|string|max:255',
            'invoice_no'     => 'nullable|string|max:100',
            'payment_status' => 'required|in:paid,pending,partial',
            'notes'          => 'nullable|string',
        ]);

        $feedExpense->update($validated);
        return redirect()->route('feed-expenses.index')->with('success', 'Record updated.');
    }

    public function destroy(FeedPurchase $feedExpense)
    {
        $feedExpense->delete();
        return back()->with('success', 'Record deleted.');
    }
}
