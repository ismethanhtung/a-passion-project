import Course from "./course";

interface Category {
    id: number;
    name: string;
    parentId: number;
    parent: Category;
    children: Category[];
    courses: Course[];
}

export default Category;
