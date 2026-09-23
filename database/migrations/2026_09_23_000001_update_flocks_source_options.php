<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("alter table `flocks` modify `source` enum('hatchery', 'purchase', 'own_breeding', 'hatched', 'gifted', 'transferred') not null default 'purchase'");

        DB::table('flocks')->where('source', 'hatchery')->update(['source' => 'hatched']);
        DB::table('flocks')->where('source', 'own_breeding')->update(['source' => 'hatched']);

        Schema::table('flocks', function (Blueprint $table) {
            $table->enum('source', ['purchase', 'hatched', 'gifted', 'transferred'])
                ->default('purchase')
                ->change();
        });
    }

    public function down(): void
    {
        DB::table('flocks')->where('source', 'hatched')->update(['source' => 'hatchery']);

        Schema::table('flocks', function (Blueprint $table) {
            $table->enum('source', ['hatchery', 'purchase', 'own_breeding'])
                ->default('purchase')
                ->change();
        });
    }
};