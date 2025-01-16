export interface NotificationType {
    _id: string;
    type: string;
    message: string;
    fromUser: string;
    recipient: string;
    createdAt: string;
    read: boolean;
    likedPostId?: string
}