import React, {useState} from 'react';

import BlogListOption from './blog-list-option';

const blogList = function BlogList() {

    const [listOption, setListOption] = useState([]);

    return (
        <>
            <div className='p-3'>
                <div className='border'>
                    <h3 className='ps-3 pt-2'>카테고리 이름</h3>
                    <hr />
                    <ul class="list-group">
                        {listOption.map(item=><BlogListOption item={item}/>)}
                    </ul>
                    <nav className='d-flex justify-content-center mt-2'>
                        <ul class="pagination">
                            <li class="page-item">
                                <a class="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item">
                                <a class="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>


            </div>
        </>
    )
}

export default blogList;