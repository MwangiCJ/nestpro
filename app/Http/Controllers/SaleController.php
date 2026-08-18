<?php

namespace App\Http\Controllers;

use App\Models\Flock;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(Request $request): Response
    {
        $farmId = $this->farmId();
        $query = Sale::where('farm_id', $farmId)->with('flock');

        if ($request->filled('sale_type')) {
            $query->where('sale_type', $request->sale_type);
        }
        if ($request->filled('from')) {
            $query->where('sale_date', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->where('sale_date', '<=', $request->to);
        }

        $sales = $query->orderByDesc('sale_date')->paginate(20)->withQueryString();

        $monthTotal = Sale::where('farm_id', $farmId)
            ->whereMonth('sale_date', now()->month)
            ->whereYear('sale_date', now()->year)
            ->sum('total_amount');

        $pendingAmount = Sale::where('farm_id', $farmId)
            ->whereIn('payment_status', ['pending', 'partial'])
            ->sum(\Illuminate\Support\Facades\DB::raw('total_amount - amount_paid'));

        $flocks = Flock::where('farm_id', $farmId)->get(['id', 'name']);

        return Inertia::render('Sales/Index', [
            'sales'         => $sales,
            'flocks'        => $flocks,
            'filters'       => $request->only(['sale_type', 'from', 'to']),
            'monthTotal'    => $monthTotal,
            'pendingAmount' => $pendingAmount,
        ]);
    }

    public function create(): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->get(['id', 'name']);
        return Inertia::render('Sales/Create', ['flocks' => $flocks]);
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'flock_id'       => 'nullable|exists:flocks,id',
            'sale_type'      => 'required|in:egg,meat,live_bird,manure,other',
            'sale_date'      => 'required|date',
            'quantity'       => 'required|numeric|min:0.01',
            'unit'           => 'required|string|max:50',
            'unit_price'     => 'required|numeric|min:0',
            'total_amount'   => 'required|numeric|min:0',
            'buyer_name'     => 'nullable|string|max:255',
            'buyer_phone'    => 'nullable|string|max:30',
            'payment_status' => 'required|in:paid,pending,partial',
            'amount_paid'    => 'nullable|numeric|min:0',
            'receipt_no'     => 'nullable|string|max:100',
            'notes'          => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;
        if ($validated['payment_status'] === 'paid') {
            $validated['amount_paid'] = $validated['total_amount'];
        }

        Sale::create($validated);
        return redirect()->route('sales.index')->with('success', 'Sale recorded successfully.');
    }

    public function edit(Sale $sale): Response
    {
        $farmId = $this->farmId();
        $flocks = Flock::where('farm_id', $farmId)->get(['id', 'name']);
        return Inertia::render('Sales/Edit', ['sale' => $sale, 'flocks' => $flocks]);
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'flock_id'       => 'nullable|exists:flocks,id',
            'sale_type'      => 'required|in:egg,meat,live_bird,manure,other',
            'sale_date'      => 'required|date',
            'quantity'       => 'required|numeric|min:0.01',
            'unit'           => 'required|string|max:50',
            'unit_price'     => 'required|numeric|min:0',
            'total_amount'   => 'required|numeric|min:0',
            'buyer_name'     => 'nullable|string|max:255',
            'buyer_phone'    => 'nullable|string|max:30',
            'payment_status' => 'required|in:paid,pending,partial',
            'amount_paid'    => 'nullable|numeric|min:0',
            'receipt_no'     => 'nullable|string|max:100',
            'notes'          => 'nullable|string',
        ]);

        $sale->update($validated);
        return redirect()->route('sales.index')->with('success', 'Sale updated.');
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return back()->with('success', 'Sale deleted.');
    }
}
