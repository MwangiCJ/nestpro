<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\House;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HousingController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(): Response
    {
        $farmId = $this->farmId();
        $houses = House::where('farm_id', $farmId)
            ->withCount(['flocks as active_flocks' => fn($q) => $q->where('status', 'active')])
            ->withSum(['flocks as current_birds' => fn($q) => $q->where('status', 'active')], 'current_quantity')
            ->get();

        return Inertia::render('Housing/Index', ['houses' => $houses]);
    }

    public function create(): Response
    {
        return Inertia::render('Housing/Create');
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'house_type' => 'required|in:deep_litter,battery_cage,free_range,pen,barn,other',
            'capacity'   => 'required|integer|min:1',
            'length_m'   => 'nullable|numeric|min:0',
            'width_m'    => 'nullable|numeric|min:0',
            'status'     => 'required|in:active,inactive,under_maintenance',
            'notes'      => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;
        House::create($validated);
        return redirect()->route('housing.index')->with('success', 'House added successfully.');
    }

    public function edit(House $housing): Response
    {
        return Inertia::render('Housing/Edit', ['house' => $housing]);
    }

    public function update(Request $request, House $housing)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'house_type' => 'required|in:deep_litter,battery_cage,free_range,pen,barn,other',
            'capacity'   => 'required|integer|min:1',
            'length_m'   => 'nullable|numeric|min:0',
            'width_m'    => 'nullable|numeric|min:0',
            'status'     => 'required|in:active,inactive,under_maintenance',
            'notes'      => 'nullable|string',
        ]);

        $housing->update($validated);
        return redirect()->route('housing.index')->with('success', 'House updated.');
    }

    public function destroy(House $housing)
    {
        $housing->delete();
        return back()->with('success', 'House removed.');
    }
}
