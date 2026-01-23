import React, { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, useList } from "@refinedev/core";
import * as z from "zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UploadWidget from "@/components/upload-widget";
import {Loader2, Plus} from "lucide-react";
import { Department } from "@/types";

/* ---------------- ZOD SCHEMA ----------------- */
const studentSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    departmentId: z.number().min(1, "Please select a department"), // ✅ expect number
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

/* ---------------- COMPONENT ----------------- */
const CreateStudents = () => {
    const back = useBack();

    // Fetch departments
    const { query } = useList<Department>({
        resource: "departments",
         pagination: { pageSize: 100 }, // fetch all
    });
    const departments = query?.data?.data || [];
    const isLoadingDepartments = query.isLoading;

    // React Hook Form
    const form = useForm({
        resolver: zodResolver(studentSchema),
        refineCoreProps: {
            resource: "students",
            action: "create",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
        setValue,
    } = form;

    // Submit handler
    const onSubmit = async (values: StudentFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error creating student:", error);
        }
    };

    // Handle image upload
    const setProfileImage = (file: any) => {
        if (file) {
            setValue("image", file.url);
            setValue("imageCldPubId", file.publicId);
        } else {
            setValue("image", "");
            setValue("imageCldPubId", "");
        }
    };

    return (
        <Card className="p-6">
            <CardHeader  className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-2xl font-bold text-gradient-orange">
                    Add a New Student
                </CardTitle>
                <Button
                    onClick={() => back()}
                >
                    Go Back
                </Button>
            </CardHeader>

            <Separator className="my-4" />

            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Name */}
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Department Dropdown */}
                        <FormField
                            control={control}
                            name="departmentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full border rounded px-3 py-2"
                                            disabled={isLoadingDepartments}
                                            value={field.value || 0}
                                            onChange={(e) => field.onChange(Number(e.target.value))} // ✅ convert string to number
                                        >
                                            <option value={0}>Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Profile Image */}
                        <FormField
                            control={control}
                            name="image"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    <FormControl>
                                        <UploadWidget onChange={setProfileImage} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator className="my-4" />

                        {/* Submit Button */}
                        <Button type="submit" size="lg" className="w-full">
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <span>Creating Student...</span>
                                    <Loader2 className="animate-spin" />
                                </div>
                            ) : (
                                "Create Student"
                            )}
                        </Button>

                        {/* Go Back */}

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CreateStudents;
