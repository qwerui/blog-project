import React from 'react';

const blogContent = function BlogContent() {

    return (
        <>
            <article className='p-3'>
                <h2>Title</h2>
                <div className='text-end'>time</div>
                <hr />
                <div>
                    Content
                </div>
            </article>
        </>
    )
}

export default blogContent;