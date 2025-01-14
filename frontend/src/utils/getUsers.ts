import axios from "@/app/api/axios"; 

export async function getAllUsers() {
    const res = await axios.get(`/users`, {
        withCredentials: true,
      });
    return res.data
}

export async function getUserInvits() {
	try {
		const { data } = await axios.get('/friends/FriendsReqs');
		return data;
	} catch (error) {
		throw new Error(`Failed to get Invitations: ${error}`);
	}
}