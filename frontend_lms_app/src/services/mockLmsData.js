//
// Mock LMS Data Service for Employee Dashboard
// Simulates progress, to-dos, and module info for UI rendering.
//

/**
 * Simulates fetching user progress, task list, and modules for dashboard.
 * We use static data, but return via async API to mimic real fetch calls.
 */

// PUBLIC_INTERFACE
export async function getEmployeeDashboardData() {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 120));
  return {
    user: {
      name: "Jordan Brooks",
      avatarUrl: "https://i.pravatar.cc/100?u=jordan.brooks@email.com",
      status: "Active",
    },
    progress: {
      percent: 62,
      completedModules: 8,
      totalModules: 13,
      completedTasks: 17,
      totalTasks: 25,
      estimatedDaysLeft: 6,
      nextModule: {
        title: "Web App Security Fundamentals",
        dueInDays: 2,
      },
    },
    todoList: [
      {
        id: 1,
        label: "Complete Module: API Authentication",
        done: true,
      },
      {
        id: 2,
        label: "Submit Project: RESTful API Challenge",
        done: false,
      },
      {
        id: 3,
        label: "Attempt Quiz: Async JS",
        done: false,
      },
      {
        id: 4,
        label: "Review feedback on Project #1",
        done: true,
      },
      {
        id: 5,
        label: "Schedule 1:1 with Mentor",
        done: false,
      },
    ],
    modules: [
      {
        id: 101,
        title: "Onboarding Overview",
        description: "Welcome & orientation to the company values and LMS.",
        status: "completed",
        color: "#2563EB",
      },
      {
        id: 102,
        title: "Company Mission & Vision",
        description: "Dive into DigitalT3's goals and key objectives.",
        status: "completed",
        color: "#2563EB",
      },
      {
        id: 103,
        title: "Security Training",
        description: "Core principles for digital security and safe working.",
        status: "in_progress",
        color: "#F59E0B",
      },
      {
        id: 104,
        title: "Git & Version Control",
        description: "Managing teamwork and codebase using Git.",
        status: "locked",
        color: "#d1d5db",
      },
      {
        id: 105,
        title: "Internal Tools + Communication",
        description: "Best practices and tooling for collaboration.",
        status: "locked",
        color: "#d1d5db",
      },
      // More modules could be added
    ],
  };
}
