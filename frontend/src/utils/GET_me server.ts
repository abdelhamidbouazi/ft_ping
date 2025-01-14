import axios from "@/app/api/axios";

export async function get_me_server() {
    const res = await axios.get(`/users/me`, {
        withCredentials: true,
      });
    return res.data
}
export async function twofa_generated() {
    const res = await axios.post(`/auth/2fa_generate`, {
        withCredentials: true,
      });
    return res.data
}