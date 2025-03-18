let newDate = new Date();
let date = newDate.getDate() - 2;
let month = newDate.getMonth() + 1;
let year = newDate.getFullYear();
let date1 = date > 9 ? date : `0${date}`;

const fetchBlogs = async () => {
    try {
        const response = await fetch(
            `https://gnews.io/api/v4/search?q=technology&from=${year}-${month}-${date1}&sortby=publishedAt&token=YOUR_GNEWS_API_TOKEN`
        );
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
};

export default fetchBlogs;
