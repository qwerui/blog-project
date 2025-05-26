export class ListDto {
    totalPage: number;
    articles: Array<ArticleClass>
}

class ArticleClass {
    article_id: number;
    title: string;
    create_time: string;
}