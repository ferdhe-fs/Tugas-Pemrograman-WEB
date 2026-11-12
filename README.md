# SIAKAD - Cyber Muhammadiyah University (SiberMu)
> Web Programming Assignment: Role-Based Authentication & Academic Dashboard

A modern, minimalist web application built with **Svelte 5** (Runes API), **TypeScript**, and **Bootstrap 5** using a unified **Navy Blue SiberMu** design system.

---

## 🏛️ University Identity
* **Institution:** Cyber Muhammadiyah University (Universitas Siber Muhammadiyah)
* **System:** SIAKAD (Academic Information System)

---

## 🔑 Registered Demo Accounts

| Role | ID Number (NIM / NIDN) | Password | User Name | Department |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `230101001` | `password123` | **MAHASISWA** | Teknik Informatika |
| **Lecturer** | `0612048501` | `password123` | **DOSEN** | Teknik Informatika |

---

## 🚀 Features Implemented

1. **Strict Role-Based Authentication:**
   * Login with ID Number and Password matching the selected role (Student / Lecturer).
   * Quick-fill 1-click buttons for effortless evaluation.
2. **Custom Logout Confirmation Modal:**
   * Beautiful popup modal confirming before signing out (no default browser alert).
3. **Semester-by-Semester Academic Transcript:**
   * Tab **Academic Transcript** with semester selectors (Semester 1, 2, and 3).
   * Grade point average (GPA / IPK) metrics, course credit summaries, and letter grades.
4. **Adaptive Sidebar Menus:**
   * **Student Portal:** Overview, Study Plan (KRS), Course Schedule, Academic Transcript, Student Profile.
   * **Lecturer Portal:** Overview, KRS Approval, Assigned Courses, Teaching Schedule, Lecturer Profile.
5. **Interactive KRS Operations:**
   * Students can enroll courses (Pending status).
   * Lecturers can Approve / Revoke course enrollment in real time.
6. **Soft Low-Contrast Dropdown Filter:**
   * Smooth dropdown for filtering courses without numbers or icons.
7. **Translucent Loading Animation:**
   * Soft faded overlay on page refresh that preserves the menu layout underneath.

---

## 🛠️ Tech Stack
* **Framework:** [Svelte 5](https://svelte.dev/) (`5.57.3`) with Runes API (`$state`, `$derived`, `$props`, `$effect`)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **CSS & Icons:** [Bootstrap 5.3](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
* **Build Tool:** [Vite](https://vitejs.dev/)

---

## 💻 How to Run
```bash
# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.
