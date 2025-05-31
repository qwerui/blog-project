import { CategoryClass } from "./category.class";

export class BlogInfoDto {
    blogId: string;
    title: string;
    id: string;
    description: string;
    image: string;
    category: Array<CategoryClass>;
}