<?php

namespace App\Policies;

use App\Models\Farm;
use App\Models\User;

class FarmPolicy
{
    public function update(User $user, Farm $farm): bool
    {
        return $user->id === $farm->user_id;
    }
}
