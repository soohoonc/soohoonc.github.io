type CourseState = {
    course: Course;
    open: boolean;
    width: number;
}


type Course = {
    courseId: string;
    courseTitle: string;
    professor: string;
    courseSummary;
    tags: string[];
    semester: string;
}


