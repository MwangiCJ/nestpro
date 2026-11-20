<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        // Expand allowed values first so legacy rows can be mapped on databases that enforce enums.
        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `flocks` MODIFY `source` ENUM('hatchery','purchase','own_breeding','hatched','gifted','transferred') NOT NULL DEFAULT 'purchase'");
        }

        DB::table('flocks')
            ->whereIn('source', ['hatchery', 'own_breeding'])
            ->update(['source' => 'hatched']);

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `flocks` MODIFY `source` ENUM('purchase','hatched','gifted','transferred') NOT NULL DEFAULT 'purchase'");
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        // Allow legacy value again before remapping data on databases that enforce enums.
        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `flocks` MODIFY `source` ENUM('hatchery','purchase','own_breeding','hatched','gifted','transferred') NOT NULL DEFAULT 'purchase'");
        }

        DB::table('flocks')
            ->where('source', 'hatched')
            ->update(['source' => 'hatchery']);

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE `flocks` MODIFY `source` ENUM('hatchery','purchase','own_breeding') NOT NULL DEFAULT 'purchase'");
        }
    }
};