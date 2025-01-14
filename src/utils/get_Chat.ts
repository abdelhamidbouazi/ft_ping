import axios from "@/app/api/axios";

export default async function get_Chats() {
    const res = await axios.get(`/chat/getdmsorgnized`, {
        withCredentials: true,
      });
    
    return res.data
}

export  async function geta_DM(username:string) {

    const res = await axios.get(`/chat/DM/${username}`, {
        withCredentials: true,
      });
    return res.data
}


