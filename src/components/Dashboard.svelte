<script lang="ts">
  import type { User } from '../types/auth';

  // Modular Student Components
  import StudentOverview from './student/StudentOverview.svelte';
  import StudyPlanKrs from './student/StudyPlanKrs.svelte';
  import CourseSchedule from './student/CourseSchedule.svelte';
  import AcademicTranscript from './student/AcademicTranscript.svelte';
  import StudentProfile from './student/StudentProfile.svelte';

  // Modular Lecturer Components
  import LecturerOverview from './lecturer/LecturerOverview.svelte';
  import KrsApproval from './lecturer/KrsApproval.svelte';
  import AssignedCourses from './lecturer/AssignedCourses.svelte';
  import TeachingSchedule from './lecturer/TeachingSchedule.svelte';
  import LecturerProfile from './lecturer/LecturerProfile.svelte';

  interface Props {
    user: User;
    activeTab: string;
    onSelectTab: (tab: string) => void;
  }

  let { user, activeTab, onSelectTab }: Props = $props();
</script>

<div class="p-3 p-md-4">
  {#if user.role === 'student'}
    {#if activeTab === 'overview'}
      <StudentOverview {user} onNavigate={onSelectTab} />
    {:else if activeTab === 'krs'}
      <StudyPlanKrs {user} />
    {:else if activeTab === 'schedule'}
      <CourseSchedule />
    {:else if activeTab === 'transcript'}
      <AcademicTranscript />
    {:else if activeTab === 'profile'}
      <StudentProfile {user} />
    {/if}
  {:else if user.role === 'lecturer'}
    {#if activeTab === 'overview'}
      <LecturerOverview {user} onNavigate={onSelectTab} />
    {:else if activeTab === 'approval'}
      <KrsApproval />
    {:else if activeTab === 'courses'}
      <AssignedCourses />
    {:else if activeTab === 'schedule'}
      <TeachingSchedule />
    {:else if activeTab === 'profile'}
      <LecturerProfile {user} />
    {/if}
  {/if}
</div>
