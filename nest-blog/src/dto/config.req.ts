export class ConfigUpdateRequset {
    blogId: string; 
    title: string;
    description: string;
    imagePath: string;
    deleteCategory: Array<number>;
    newCategory: Array<string>;
}