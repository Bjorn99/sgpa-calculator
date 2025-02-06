import { calculateSGPA, calculateCGPA, toPercentage, formatPercentage } from './modules/converter.js';

let semesters = [{
    courses: [],
    sgpa: 0
}];
let currentSemesterIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    addInitialCourse();
    initializeTheme();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function setupEventListeners() {
    document.getElementById('addCourse')?.addEventListener('click', addCourse);
    document.getElementById('prevSemester')?.addEventListener('click', handlePrevSemester);
    document.getElementById('nextSemester')?.addEventListener('click', handleNextSemester);

    const coursesContainer = document.getElementById('coursesContainer');
    if (coursesContainer) {
        coursesContainer.addEventListener('click', handleCourseRemoval);
        coursesContainer.addEventListener('input', handleInputChange);
    }
}

function createCourseElement() {
    const courseRow = document.createElement('div');
    courseRow.className = 'course-row grid grid-cols-12 gap-4 items-center animate-fade-in';
    courseRow.innerHTML = `
        <div class="col-span-6">
            <input type="text" placeholder="Course Name"
                   class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
        </div>
        <div class="col-span-2">
            <input type="number" placeholder="Credits"
                   class="course-credits w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                   min="1" max="6">
        </div>
        <div class="col-span-3">
            <input type="number" placeholder="Grade Points"
                   class="course-grade w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                   min="0" max="10" step="1">
        </div>
        <div class="col-span-1">
            <button class="remove-course text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `;
    return courseRow;
}

function addInitialCourse() {
    const coursesContainer = document.getElementById('coursesContainer');
    if (coursesContainer && semesters[currentSemesterIndex].courses.length === 0) {
        semesters[currentSemesterIndex].courses.push({ name: '', credits: 0, gradePoint: 0 });
        coursesContainer.appendChild(createCourseElement());
    }
}

function addCourse() {
    const coursesContainer = document.getElementById('coursesContainer');
    if (coursesContainer) {
        semesters[currentSemesterIndex].courses.push({ name: '', credits: 0, gradePoint: 0 });
        coursesContainer.appendChild(createCourseElement());
        updateRemoveButtons();
    }
}

function handlePrevSemester() {
    saveSemesterData();
    currentSemesterIndex--;
    updateSemesterView();
    document.getElementById('prevSemester').classList.toggle('hidden', currentSemesterIndex === 0);
    document.getElementById('nextSemester').classList.remove('hidden');
}

function handleNextSemester() {
    saveSemesterData();
    
    if (currentSemesterIndex === semesters.length - 1) {
        semesters.push({ courses: [], sgpa: 0 });
    }
    
    currentSemesterIndex++;
    updateSemesterView();
    document.getElementById('prevSemester').classList.remove('hidden');
}

function saveSemesterData() {
    const courses = [];
    document.querySelectorAll('.course-row').forEach(row => {
        courses.push({
            name: row.querySelector('input[type="text"]').value,
            credits: parseFloat(row.querySelector('.course-credits').value) || 0,
            gradePoint: parseFloat(row.querySelector('.course-grade').value) || 0
        });
    });
    semesters[currentSemesterIndex].courses = courses;
    semesters[currentSemesterIndex].sgpa = calculateSGPA(courses);
}

function updateSemesterView() {
    document.getElementById('currentSemester').textContent = currentSemesterIndex + 1;
    
    const coursesContainer = document.getElementById('coursesContainer');
    coursesContainer.innerHTML = `
        <div class="grid grid-cols-12 gap-4 text-sm text-gray-500 dark:text-gray-400 pb-2">
            <div class="col-span-6">Course Name</div>
            <div class="col-span-2">Credits</div>
            <div class="col-span-3">Grade Points</div>
            <div class="col-span-1"></div>
        </div>
    `;
    
    const semester = semesters[currentSemesterIndex];
    if (semester.courses.length === 0) {
        addInitialCourse();
    } else {
        semester.courses.forEach(course => {
            const courseElement = createCourseElement();
            courseElement.querySelector('input[type="text"]').value = course.name;
            courseElement.querySelector('.course-credits').value = course.credits || '';
            courseElement.querySelector('.course-grade').value = course.gradePoint || '';
            coursesContainer.appendChild(courseElement);
        });
    }
    
    updateRemoveButtons();
    updateResults();
}

function handleCourseRemoval(event) {
    const removeButton = event.target.closest('.remove-course');
    if (!removeButton) return;

    const courseRow = removeButton.closest('.course-row');
    const index = Array.from(courseRow.parentNode.children).indexOf(courseRow) - 1;

    if (semesters[currentSemesterIndex].courses.length > 1) {
        semesters[currentSemesterIndex].courses.splice(index, 1);
        courseRow.remove();
        updateRemoveButtons();
        updateResults();
    }
}

function handleInputChange() {
    saveSemesterData();
    updateResults();
}

function updateResults() {
    const sgpa = calculateSGPA(semesters[currentSemesterIndex].courses);
    const cgpa = calculateCGPA(semesters);
    
    // Update SGPA and its percentage
    document.getElementById('sgpaResult').textContent = sgpa;
    document.getElementById('sgpaPercentage').textContent = formatPercentage(toPercentage(sgpa));
    
    // Update CGPA and its percentage
    document.getElementById('cgpaResult').textContent = cgpa;
    document.getElementById('cgpaPercentage').textContent = formatPercentage(toPercentage(cgpa));
    
    document.getElementById('semesterCount').textContent = semesters.length;
}

function updateRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-course');
    const shouldHide = semesters[currentSemesterIndex].courses.length <= 1;
    removeButtons.forEach(button => button.classList.toggle('hidden', shouldHide));
}