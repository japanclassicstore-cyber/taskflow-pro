'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import KanbanBoard from '@/components/KanbanBoard';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatus } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
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

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === TaskStatus.DONE).length,
    inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your tasks today.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Total Tasks',
                value: stats.total,
                icon: CheckCircle2,
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10',
              },
              {
                title: 'To Do',
                value: stats.todo,
                icon: Clock,
                color: 'text-orange-500',
                bgColor: 'bg-orange-500/10',
              },
              {
                title: 'In Progress',
                value: stats.inProgress,
                icon: TrendingUp,
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10',
              },
              {
                title: 'Completed',
                value: stats.completed,
                icon: CheckCircle2,
                color: 'text-green-500',
                bgColor: 'bg-green-500/10',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                {stat.title === 'Completed' && stats.total > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{completionRate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-green-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Kanban Board */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <KanbanBoard />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
