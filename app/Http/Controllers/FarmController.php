<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FarmController extends Controller
{
    public function index(): Response
    {
        $farm = auth()->user()->farms()->first();
        return Inertia::render('Farm/Index', ['farm' => $farm]);
    }

    public function create(): Response
    {
        return Inertia::render('Farm/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'owner_name'       => 'required|string|max:255',
            'location'         => 'nullable|string|max:255',
            'address'          => 'nullable|string',
            'phone'            => 'nullable|string|max:30',
            'email'            => 'nullable|email|max:255',
            'established_date' => 'nullable|date',
            'farm_type'        => 'required|in:layer,broiler,dual_purpose,turkey,duck,mixed',
            'notes'            => 'nullable|string',
            'currency'         => 'nullable|string|max:10',
        ]);

        auth()->user()->farms()->create($validated);
        return redirect()->route('dashboard')->with('success', 'Farm created successfully.');
    }

    public function edit(Farm $farm): Response
    {
        $this->authorize('update', $farm);
        return Inertia::render('Farm/Edit', ['farm' => $farm]);
    }

    public function update(Request $request, Farm $farm)
    {
        $this->authorize('update', $farm);
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'owner_name'       => 'required|string|max:255',
            'location'         => 'nullable|string|max:255',
            'address'          => 'nullable|string',
            'phone'            => 'nullable|string|max:30',
            'email'            => 'nullable|email|max:255',
            'established_date' => 'nullable|date',
            'farm_type'        => 'required|in:layer,broiler,dual_purpose,turkey,duck,mixed',
            'notes'            => 'nullable|string',
            'currency'         => 'nullable|string|max:10',
        ]);

        $farm->update($validated);
        return redirect()->route('farm.index')->with('success', 'Farm updated successfully.');
    }
}
