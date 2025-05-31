export class ConfigUpdateRequset {
    blogId: string; 
    title: string;
    description: string;
    deleteCategory: Array<number>;
    newCategory: Array<string>;
}