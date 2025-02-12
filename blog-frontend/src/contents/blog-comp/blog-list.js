import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';

import BlogListOption from './blog-list-option';
import axios from 'axios';
import config from 'config.json';

const blogList = function BlogList() {

    const location = useLocation();

    const [listOption, setListOption] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [pagination, setPagination] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const id = useRef("");
    const category = useRef();
    const page = useRef(0);
    const totalPage = useRef(0);

    useEffect(() => {
        id.current = location.pathname.split("/")[2];
        const search = new URLSearchParams(location.search);
        category.current = search.get("category");
        const name = search.get("name") ?? "전체글보기";
        page.current = search.get("page") ?? 0;

        setCategoryName(name);

        const fetch = async () => {
            try {
                const response = await axios.get(config["blog-backend"] + "/api/blog/list", {
                    params: {
                        id: id.current,
                        category: category.current,
                        page: page.current
                    }
                });
                setListOption(response.data.articles);
                totalPage.current = response.data.totalPage;
                setPagination(getPaginationNumbers(page.current, totalPage.current));
            } catch (err) {
                if (err.status === 404) {
                    setIsEmpty(true);
                }
            }
        }
        fetch();
    }, [location.pathname, location.search]);

    function getPaginationNumbers(currentPage, totalPages, maxVisiblePages = 5) {
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        start = Math.max(1, end - maxVisiblePages + 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    return (
        <>
            <div className='p-3'>
                <div className='border'>
                    <h3 className='ps-3 pt-2'>{categoryName}</h3>
                    <hr />
                    {
                        !isEmpty ?
                            <>
                                <ul className="list-group">
                                    {listOption.map(item => <BlogListOption item={item} id={id.current} />)}
                                </ul>
                                <nav className='d-flex justify-content-center mt-2'>
                                    <ul className="pagination">
                                        <li className="page-item">
                                            <Link className={page.current === 0 ? "page-link disabled" : "page-link"} to={{ pathname: `/blog/${id.current}/list`, search: `?category=${category.current}&page=${page.current - 2}&name=${categoryName}` }} aria-label="Previous">
                                                <span aria-hidden="true">&laquo;</span>
                                            </Link>
                                        </li>
                                        {
                                            pagination.map(item =>
                                                <li className="page-item"><Link className={page.current === item - 1 ? "page-link active" : "page-link"} to={{ pathname: `/blog/${id.current}/list`, search: `?category=${category.current}&page=${item - 1}&name=${categoryName}` }}>{item}</Link></li>
                                            )
                                        }
                                        <li className="page-item">
                                            <Link className={page.current === totalPage.current - 1 ? "page-link disabled" : "page-link"} to={{ pathname: `/blog/${id.current}/list`, search: `?category=${category.current}&page=${page.current}&name=${categoryName}` }} aria-label="Previous">
                                                <span aria-hidden="true">&raquo;</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </> :
                            <h2>게시글이 존재하지 않습니다.</h2>
                    }
                </div>
            </div>
        </>
    )
}

export default blogList;