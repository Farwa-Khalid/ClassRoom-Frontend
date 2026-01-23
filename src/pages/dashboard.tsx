import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassDetails, Subject, User } from "@/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";

const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28", "#AA336A", "#33AA77"];

const Dashboard = () => {
    // --- Fetch data ---
    const { query: studentsQuery } = useList<User>({
        resource: "users",
        filters: [{ field: "role", operator: "eq", value: "student" }],
        pagination: { pageSize: 100 },
    });
    const { query: teachersQuery } = useList<User>({
        resource: "users",
        filters: [{ field: "role", operator: "eq", value: "teacher" }],
        pagination: { pageSize: 100 },
    });
    const { query: subjectsQuery } = useList<Subject>({ resource: "subjects", pagination: { pageSize: 100 } });
    const { query: classesQuery } = useList<ClassDetails>({ resource: "classes", pagination: { pageSize: 100 } });

    const students = studentsQuery?.data?.data ?? [];
    const teachers = teachersQuery?.data?.data ?? [];
    const subjects = subjectsQuery?.data?.data ?? [];
    const classes = classesQuery?.data?.data ?? [];

    // Active / Inactive classes
    const activeClasses = classes.filter((cls) => cls.status === "active").length;
    const inactiveClasses = classes.filter((cls) => cls.status === "inactive").length;

    // Students per class (use capacity as placeholder)
    const studentsPerClassData = classes.map((cls) => ({
        name: cls.name,
        value: cls.capacity ?? 0,
    }));

    // Students per subject (dummy example)
    const studentsPerSubjectData = subjects.map((subject, idx) => ({
        name: subject.name,
        students: Math.floor(Math.random() * 50) + 5, // random for demo
    }));

    // Active/Inactive classes data
    const classStatusData = [
        { name: "Active", value: activeClasses },
        { name: "Inactive", value: inactiveClasses },
    ];

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold text-gradient-orange">Dashboard</h1>
            <p className="text-gray-600">Overview of your classroom management system</p>
            <Separator />

            {/* --- Summary Cards --- */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{students.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{teachers.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Subjects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{subjects.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Classes Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {classes.length} ({activeClasses} active, {inactiveClasses} inactive)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* --- Charts --- */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Students per Class */}
                <Card>
                    <CardHeader>
                        <CardTitle>Students per Class</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={studentsPerClassData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {studentsPerClassData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Students per Subject */}
                <Card>
                    <CardHeader>
                        <CardTitle>Students per Subject</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={studentsPerSubjectData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="students" fill="#00C49F" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Active vs Inactive Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Class Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={classStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#FFBB28"
                                    label
                                >
                                    {classStatusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Enrollments Timeline (dummy for now) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={studentsPerClassData.map((cls, idx) => ({
                                    name: cls.name,
                                    enrolled: Math.floor(Math.random() * (cls.value + 1)), // dummy
                                }))}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="enrolled" stroke="#0088FE" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
