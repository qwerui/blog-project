const formatter = {
    ConvertArticleTime(utcTime) {
        const localArticle = new Date(utcTime);
        const localNow = new Date();

        let same = true;
        same &= localArticle.getFullYear() === localNow.getFullYear();
        same &= localArticle.getMonth() === localNow.getMonth();
        same &= localArticle.getDate() === localNow.getDate();

        if(same) {
            return `${localArticle.getHour()}:${localArticle.getMinute()}`;
        } else {
            return `${localArticle.getFullYear() === localNow.getFullYear() ? "" : localArticle.getFullYear()+"." }${localArticle.getMonth()+1}.${localArticle.getDate()}`;
        }

    }
}

export default formatter;