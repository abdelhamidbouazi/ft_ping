import axios from "@/app/api/axios";

export default async function get_friends() {
    const res = await axios.get(`/friends/My_Friends`, {
        withCredentials: true,
      });

    return res.data
}
export async function get_users() {
    const res = await axios.get(`/users`, {
        withCredentials: true,
      });

    return res.data
}
export async function get_freinds_reqs() {


    const res = await axios.get(`/friends/FriendsReqs`, {
        withCredentials: true,
      });

    return res.data
}
export async function user_status(username: string) {
    const res = await axios.get(`/users/${username}`, {
        withCredentials: true,
      });

    return res.data
}

