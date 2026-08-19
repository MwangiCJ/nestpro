<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFarmExists
{
    /**
     * Redirect users without a farm to the farm setup page instead of
     * letting downstream controllers 404 via firstOrFail().
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth()->user()->farms()->exists()) {
            return redirect()
                ->route('farm.create')
                ->with('warning', 'Please set up your farm before continuing.');
        }

        return $next($request);
    }
}
