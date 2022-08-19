<?php

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {

        // The same options that can be provided to a specific client constructor can also be supplied to the Aws\Sdk class.
        // Use the us-west-2 region and latest version of each client.

        $sharedConfig = [
            'region' => env('AWS_DEFAULT_REGION', 'us-west-2'),
            'version' => 'latest'
        ];

        // Create an SDK class used to share configuration across clients.
        $sdk = new Aws\Sdk($sharedConfig);
        // Create an Amazon S3 client using the shared configuration data.
        $client = $sdk->createChime();

        $meeting_response = $client->createMeeting([
            'ClientRequestToken' => 'my-meeting',
            'MediaRegion' => 'us-west-2'
        ]);

        $meeting_id =  $meeting_response['Meeting']['MeetingId'];

        $attendee_response = $client->createAttendee([
            'MeetingId' => $meeting_id,
            'ExternalUserId' => Str::uuid()
        ]);

        return Inertia::render('Dashboard', [
            'meeting_credentials' => [
                'meeting_response' => $meeting_response['Meeting'],
                'attendee_response' => $attendee_response['Attendee']
            ]
        ]);
    })->name('dashboard');
});
