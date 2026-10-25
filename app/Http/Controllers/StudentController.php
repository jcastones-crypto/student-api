<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Student::all(),
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_number' => 'required|string|unique:students,student_number',
            'first_name'     => 'required|string|max:100',
            'last_name'      => 'required|string|max:100',
            'email'          => 'required|email|unique:students,email',
            'course'         => 'required|string|max:100',
            'year_level'     => 'required|integer|between:1,6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $student = Student::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data'    => $student,
        ], 201);
    }
    
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $student,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'student_number' => 'required|string|unique:students,student_number,' . $id,
            'first_name'     => 'required|string|max:100',                      
            'last_name'      => 'required|string|max:100',
            'email'          => 'required|email|unique:students,email,' . $id,
            'course'         => 'required|string|max:100',
            'year_level'     => 'required|integer|between:1,6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $student->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data'    => $student,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
    }
}
