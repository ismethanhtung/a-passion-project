import ForumPost from "@/interfaces/forum/forumPost";

interface PostCardProps {
    post: ForumPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <div className="border border-gray-300 rounded-xl shadow-sm p-5 mb-6 bg-white hover:border-violet-500 hover:shadow-lg transition-shadow">
            <div className="mb-3">
                <h2 className="text-lg font-semibold text-violet-400">
                    Author ID: {post.authorId}
                </h2>
                <p className="text-gray-700">{post.content}</p>
                <small className="text-gray-500 block mt-2">
                    {new Date(post.createdAt).toLocaleString()}
                </small>
            </div>

            <div className="flex space-x-6 text-sm text-gray-600 border-t pt-4">
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 font-medium transition">
                    <img className="w-4 h-4" src="/icons/like.png" alt="Like" />
                    <span>Like</span>
                </button>

                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 font-medium transition">
                    <img className="w-4 h-4" src="/icons/comment.png" alt="Comment" />
                    <span>Reply</span>
                </button>

                <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 font-medium transition">
                    <img className="w-5 h-5" src="/icons/problem.png" alt="Report" />
                    <span>Report</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
