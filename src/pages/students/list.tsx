import React from "react";
import { useList, useDelete } from "@refinedev/core";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Student } from "@/types";
import { useNavigate } from "react-router-dom";

const ListStudents = () => {
    const navigate = useNavigate();

    const { query } = useList<Student>({ resource: "students" });
    const students = query.data?.data || [];
    const isLoading = query.isLoading;
    const isError = query.isError;

    const { mutate: deleteStudent } = useDelete<Student>();

    if (isLoading) return <div>Loading students...</div>;
    if (isError) return <div>Failed to load students</div>;

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Students</h1>
                <Button onClick={() => navigate("/students/create")}>
                    Create Student
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.department?.name ?? "-"}</TableCell>
                            <TableCell>
                                {student.createdAt
                                    ? new Date(student.createdAt).toLocaleDateString()
                                    : "-"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        if (window.confirm(`Delete ${student.name}?`)) {
                                            deleteStudent({
                                                resource: "students",
                                                id: student.id,
                                                mutationMode: "optimistic", // <- correct place
                                            });
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default ListStudents;
