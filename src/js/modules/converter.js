export const CONVERSION_FACTOR = 9.5;

export function calculateSGPA(courses) {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
        if (course.credits && course.gradePoint) {
            totalCredits += parseFloat(course.credits);
            totalGradePoints += (parseFloat(course.credits) * parseFloat(course.gradePoint));
        }
    });

    return totalCredits ? (totalGradePoints / totalCredits).toFixed(2) : 0;
}

export function calculateCGPA(semesters) {
    let totalWeightedSGPA = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
        let semesterCredits = 0;
        let semesterGradePoints = 0;

        semester.courses.forEach(course => {
            if (course.credits && course.gradePoint) {
                semesterCredits += parseFloat(course.credits);
                semesterGradePoints += (parseFloat(course.credits) * parseFloat(course.gradePoint));
            }
        });

        if (semesterCredits > 0) {
            totalWeightedSGPA += semesterGradePoints;
            totalCredits += semesterCredits;
        }
    });

    return totalCredits ? (totalWeightedSGPA / totalCredits).toFixed(2) : 0;
}

export function toPercentage(gpa) {
    return (parseFloat(gpa) * CONVERSION_FACTOR).toFixed(2);
}

export function formatPercentage(percentage) {
    return percentage ? `(${percentage}%)` : '(-)';
}

export function isValidCourse(course) {
    return (
        course.credits >= 1 && 
        course.credits <= 6 && 
        course.gradePoint >= 0 && 
        course.gradePoint <= 10
    );
}

export function getTotalCredits(courses) {
    return courses.reduce((total, course) => 
        total + (parseFloat(course.credits) || 0), 0);
}