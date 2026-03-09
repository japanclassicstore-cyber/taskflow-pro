'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatus, TaskPriority } from '@/types';

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchTasks();
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Status distribution data
  const statusData = [
    { name: 'To Do', value: tasks.filter((t) => t.status === TaskStatus.TODO).length, color: '#6b7280' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length, color: '#3b82f6' },
    { name: 'Review', value: tasks.filter((t) => t.status === TaskStatus.REVIEW).length, color: '#a855f7' },
    { name: 'Done', value: tasks.filter((t) => t.status === TaskStatus.DONE).length, color: '#22c55e' },
  ];

  // Priority distribution data
  const priorityData = [
    { name: 'Low', value: tasks.filter((t) => t.priority === TaskPriority.LOW).length },
    { name: 'Medium', value: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length },
    { name: 'High', value: tasks.filter((t) => t.priority === TaskPriority.HIGH).length },
    { name: 'Urgent', value: tasks.filter((t) => t.priority === TaskPriority.URGENT).length },
  ];

  // Productivity trend (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = tasks.filter((t) => {
        const taskDate = new Date(t.updatedAt).toISOString().split('T')[0];
        return taskDate === dateStr && t.status === TaskStatus.DONE;
      }).length;

      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed,
      });
    }
    return days;
  };

  const productivityData = getLast7Days();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              Visualize your productivity and task insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Priority Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Priority Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Productivity Trend */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-lg p-6 lg:col-span-2"
            >
              <h2 className="text-xl font-semibold mb-4">Completed Tasks (Last 7 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-lg p-6 lg:col-span-2"
            >
              <h2 className="text-xl font-semibold mb-4">Quick Insights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Tasks', value: tasks.length, color: 'text-blue-500' },
                  { 
                    label: 'Completion Rate', 
                    value: tasks.length > 0 
                      ? `${((tasks.filter(t => t.status === TaskStatus.DONE).length / tasks.length) * 100).toFixed(0)}%`
                      : '0%',
                    color: 'text-green-500'
                  },
                  { 
                    label: 'Avg. Tasks/Day', 
                    value: (tasks.length / 7).toFixed(1),
                    color: 'text-purple-500'
                  },
                  { 
                    label: 'High Priority', 
                    value: tasks.filter(t => 
                      t.priority === TaskPriority.HIGH || t.priority === TaskPriority.URGENT
                    ).length,
                    color: 'text-red-500'
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
