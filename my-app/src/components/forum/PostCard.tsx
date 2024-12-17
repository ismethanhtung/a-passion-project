import ForumPost from "@/interfaces/forum/forumPost";

interface PostCardProps {
    post: ForumPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <div className="border rounded-lg shadow-md p-4 mb-6">
            <div className="mb-4">
                <h2 className="text-xl ">authorId{post.authorId}</h2>
                <p className="text-gray-700">{post.content}</p>
                <small className="text-gray-500">{new Date(post.createdAt).toLocaleString()}</small>
            </div>
        </div>
    );
};

export default PostCard;
