import { CategoryClass } from "./category.class";

export class ConfigDto {
    blog_id: string;
    title: string;
    id: string;
    description: string;
    image: string;
    category: Array<CategoryClass>;
}