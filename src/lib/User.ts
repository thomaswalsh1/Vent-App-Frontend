export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    following: string[];
    followers: string[];
    bio: string;
    pfp: string;
    posts: string[];
    num_posts: number;
    num_followers: number;
    num_following: number;
}