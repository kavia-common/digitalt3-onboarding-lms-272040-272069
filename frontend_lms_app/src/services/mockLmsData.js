//
// Mock LMS Data Service for Employee & Admin Dashboards
// Provides typed models (JSDoc style), async API mocks for all dashboard UIs.
// Also provides mock module detail + quiz APIs for ModuleViewer and Quiz
//

/**
 * Simulates fetching user progress, task list, and modules for the employee dashboard.
 * Uses static data, but returns via async API to mimic real fetch calls.
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

/**
 * Gets a detailed learning module by ID, with sample content and quiz.
 * The content is HTML (may insert more modules as needed).
 * @param {number} moduleId
 * @returns {Promise<{id, title, description, content, quiz: {title, questions:array}}>}
 */
export async function getModuleById(moduleId) {
  await new Promise((res) => setTimeout(res, 80));
  // Demo static modules & quiz
  const demoModules = {
    103: {
      id: 103,
      title: "Security Training",
      description: "Core principles for digital security and safe working.",
      content: `
        <p>Welcome to the Security Training module. You will learn about:</p>
        <ul>
          <li>Why strong passwords are important</li>
          <li>How to avoid phishing emails</li>
          <li>Company privacy rules</li>
        </ul>
        <p><strong>Tip:</strong> Never share your password. Always verify email senders before clicking links.</p>
      `,
      quiz: {
        title: "Security Check!",
        questions: [
          {
            id: "q1", type: "mc", required: true,
            prompt: "Which is the strongest password?",
            choices: [
              "password123", "Company2024", "$jGFzA9#19!"
            ],
            answer: "$jGFzA9#19!",
          },
          {
            id: "q2", type: "tf", required: true,
            prompt: "You should click any link that appears to come from IT support.",
            answer: "False",
          }
        ]
      }
    },
    104: {
      id: 104,
      title: "Git & Version Control",
      description: "Managing teamwork and codebase using Git.",
      content: `
        <p>This module covers:</p>
        <ul>
          <li>Basic git workflow: init, clone, commit, push, pull</li>
          <li>Resolving conflicts and branching</li>
          <li>Why version control matters for engineering teams</li>
        </ul>
        <p>Remember, always commit regularly and write meaningful commit messages!</p>
      `,
      quiz: {
        title: "Git Basics Mini-Quiz",
        questions: [
          {
            id: "q1",
            type: "mc",
            required: true,
            prompt: "What command creates a new local Git repository?",
            choices: ["git clone", "git init", "git commit"],
            answer: "git init"
          },
          {
            id: "q2",
            type: "tf",
            required: true,
            prompt: "You should write commit messages that clearly describe your changes.",
            answer: "True"
          }
        ]
      }
    }
  };
  // fallback for demo
  return (
    demoModules[moduleId] || Object.values(demoModules)[0]
  );
}

/**
 * Validates quiz answers, returns result object.
 * @param {number} moduleId
 * @param {{[qid]: answer}} answers
 * @returns {Promise<{passed: boolean, score: number, error?:string}>}
 */
export async function submitQuizAnswers(moduleId, answers) {
  await new Promise(res => setTimeout(res, 80));
  const mod = await getModuleById(moduleId);
  if (!mod || !mod.quiz || !mod.quiz.questions) return { passed: false, score: 0 };
  let correct = 0, total = mod.quiz.questions.length;
  for (const q of mod.quiz.questions) {
    if ((answers[q.id] || "").toString().trim() === (q.answer || "").toString().trim()) {
      correct += 1;
    }
  }
  const scorePct = Math.round((correct / total) * 100);
  return {
    passed: scorePct >= 60,
    score: scorePct
  };
}

/**
 * Updates module progress (mock: no-op, but returns Promise)
 * @param {number} moduleId
 * @param {{status: string, score?: number}} progress
 * @returns {Promise<void>}
 */
export async function updateModuleProgress(moduleId, progress) {
  // Here we could call Supabase or backend (for now, just resolve)
  await new Promise(res => setTimeout(res, 60));
  return;
}

/**
 * TypeScript-style types for Admin Dashboard data.
 * 
 * @typedef {Object} AdminUser
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {"employee"|"admin"} role
 * @property {"Active"|"Suspended"|"Pending"} status
 * @property {string} avatarUrl
 * 
 * @typedef {Object} ModuleTrack
 * @property {number} id
 * @property {string} name
 * @property {"Track"|"Module"} type
 * @property {number} numModules
 * 
 * @typedef {Object} Submission
 * @property {number} id
 * @property {AdminUser} user
 * @property {string} projectTitle
 * @property {string} submittedAt
 * @property {"pending"|"approved"} status
 */

/**
 * Simulates fetching admin dashboard panels data.
 * Returns a Promise<{users: AdminUser[], tracks: ModuleTrack[], submissions: Submission[]}>
 */
// PUBLIC_INTERFACE
export async function getAdminDashboardData() {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 100));
  // Demo users
  const users = [
    {
      id: 1,
      name: "Alex Green",
      email: "alex.green@digitalt3.com",
      role: "admin",
      status: "Active",
      avatarUrl: "https://i.pravatar.cc/100?u=alex.green@digitalt3.com",
    },
    {
      id: 2,
      name: "Jordan Brooks",
      email: "jordan.brooks@email.com",
      role: "employee",
      status: "Active",
      avatarUrl: "https://i.pravatar.cc/100?u=jordan.brooks@email.com",
    },
    {
      id: 3,
      name: "Riley Sun",
      email: "riley.sun@email.com",
      role: "employee",
      status: "Suspended",
      avatarUrl: "https://i.pravatar.cc/100?u=riley.sun@email.com",
    },
    {
      id: 4,
      name: "Morgan Patel",
      email: "m.patel@email.com",
      role: "employee",
      status: "Active",
      avatarUrl: "https://i.pravatar.cc/100?u=m.patel@email.com",
    }
  ];
  // Demo tracks/modules
  const tracks = [
    {
      id: 101,
      name: "Onboarding Core Track",
      type: "Track",
      numModules: 8,
    },
    {
      id: 102,
      name: "Security Essentials",
      type: "Module",
      numModules: 1,
    },
    {
      id: 103,
      name: "Company Mission",
      type: "Module",
      numModules: 1,
    }
  ];
  // Demo submissions
  const submissions = [
    {
      id: 1001,
      user: users[1],
      projectTitle: "RESTful API Challenge",
      submittedAt: "2024-06-04",
      status: "pending",
    },
    {
      id: 1002,
      user: users[2],
      projectTitle: "Async JS Exercise",
      submittedAt: "2024-06-02",
      status: "approved",
    },
    {
      id: 1003,
      user: users[3],
      projectTitle: "Intro Project",
      submittedAt: "2024-05-27",
      status: "pending",
    }
  ];
  return { users, tracks, submissions };
}

// For IDE/completion: type exports (no effect in JS)
export const type = {}; // {AdminUser, ModuleTrack, Submission}
