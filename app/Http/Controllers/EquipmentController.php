<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\House;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentController extends Controller
{
    private function farmId(): int
    {
        return auth()->user()->farms()->firstOrFail()->id;
    }

    public function index(): Response
    {
        $farmId = $this->farmId();
        $equipment = Equipment::where('farm_id', $farmId)->with('house')->orderBy('name')->get();
        return Inertia::render('Equipment/Index', ['equipment' => $equipment]);
    }

    public function create(): Response
    {
        $farmId = $this->farmId();
        $houses = House::where('farm_id', $farmId)->get(['id', 'name']);
        return Inertia::render('Equipment/Create', ['houses' => $houses]);
    }

    public function store(Request $request)
    {
        $farmId = $this->farmId();
        $validated = $request->validate([
            'house_id'              => 'nullable|exists:houses,id',
            'name'                  => 'required|string|max:255',
            'category'              => 'required|in:feeder,drinker,heater,incubator,hatcher,cage,egg_tray,weighing_scale,sprayer,generator,vehicle,other',
            'quantity'              => 'required|integer|min:1',
            'condition'             => 'required|in:good,fair,poor,damaged',
            'purchase_date'         => 'nullable|date',
            'purchase_cost'         => 'nullable|numeric|min:0',
            'supplier'              => 'nullable|string|max:255',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'notes'                 => 'nullable|string',
        ]);

        $validated['farm_id'] = $farmId;
        Equipment::create($validated);
        return redirect()->route('equipment.index')->with('success', 'Equipment added.');
    }

    public function edit(Equipment $equipment): Response
    {
        $farmId = $this->farmId();
        $houses = House::where('farm_id', $farmId)->get(['id', 'name']);
        return Inertia::render('Equipment/Edit', ['equipment' => $equipment->load('house'), 'houses' => $houses]);
    }

    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'house_id'              => 'nullable|exists:houses,id',
            'name'                  => 'required|string|max:255',
            'category'              => 'required|in:feeder,drinker,heater,incubator,hatcher,cage,egg_tray,weighing_scale,sprayer,generator,vehicle,other',
            'quantity'              => 'required|integer|min:1',
            'condition'             => 'required|in:good,fair,poor,damaged',
            'purchase_date'         => 'nullable|date',
            'purchase_cost'         => 'nullable|numeric|min:0',
            'supplier'              => 'nullable|string|max:255',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'notes'                 => 'nullable|string',
        ]);

        $equipment->update($validated);
        return redirect()->route('equipment.index')->with('success', 'Equipment updated.');
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();
        return back()->with('success', 'Equipment removed.');
    }
}
