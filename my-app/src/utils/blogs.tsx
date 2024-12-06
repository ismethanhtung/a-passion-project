let newDate = new Date();
let date = newDate.getDate() - 2;
let month = newDate.getMonth() + 1;
let year = newDate.getFullYear();
let date1 = date > 9 ? date : `0${date}`;

const fetchBlogs = async () => {
    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=technology&from=${year}-${month}-${date1}&sortBy=publishedAt&apiKey=ac4bd79fc7c547ec9964d7e43f0f823b`
        );
        const data = await response.json();
        return data.articles;
        // setFilteredBlogs(data.articles);
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
};

export default fetchBlogs;
