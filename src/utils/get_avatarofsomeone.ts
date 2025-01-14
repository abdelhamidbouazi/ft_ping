import axios from "@/app/api/axios";

export default async function get_a_user_data(username: string): Promise<any> {
    const res = await axios.get(`/users/${username}`, {
        withCredentials: true,
      });
    return res.data
}

export async function organize_friends(friends: any, user: string): Promise<Map<string, Buffer>> {
    const myfr = new Map<string, Buffer>();

    for (let i = 0; i < friends.length; i++) {
        const friend = friends[i];
        const sender = friend.sender;
        const receiver = friend.receiver;
        if (sender === user) {
            const a_user = await get_a_user_data(receiver);
            myfr.set(receiver, a_user.avatar);
        }

        if (receiver === user) {
            const a_user = await get_a_user_data(sender);
            myfr.set(sender, a_user.avatar);
        }
    }

    return myfr;
}
