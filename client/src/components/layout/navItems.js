import { LayoutDashboard, FileSearch, Files, Briefcase, MessageSquare, Route, History, Settings, FilePen } from 'lucide-react';

// [path, label, icon]. Shared by the dashboard sidebar and Overview.jsx.
export const NAV_ITEMS = [
  ['/dashboard', 'Overview', LayoutDashboard],
  ['/dashboard/analyze', 'Analyze Resume', FileSearch],
  ['/dashboard/builder', 'Resume Builder', FilePen],
  ['/dashboard/resumes', 'My Resumes', Files],
  ['/dashboard/jobs', 'Job Matches', Briefcase],
  ['/dashboard/interviews', 'Interview Prep', MessageSquare],
  ['/dashboard/roadmap', 'Skill Roadmap', Route],
  ['/dashboard/history', 'Analysis History', History],
  ['/dashboard/settings', 'Settings', Settings],
];
