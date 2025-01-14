import axios from "@/app/api/axios";

export default async function get_me_fromClient() {
    const res = await axios.get(`/users/me`, {
        withCredentials: true,
      });
    return res.data
}
