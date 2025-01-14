import axios from '@/app/api/axios';
import { cookies } from 'next/headers';

const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? '';
}

export default async function get_avatar() {
    const cookie = await getCookie('jwt_token_mine');
    const res = await axios.get(`/users/data`, {
        withCredentials: true,
      });

    const data = await res.data.blob();
    return data
}
