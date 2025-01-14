import axios from "@/app/api/axios";

export async function getMessages(username: string) {
	const res = await axios.get(`/chat/DM/${username}`, {
        withCredentials: true,
      });
	return res.data
}

export async function getDirectMessages( url ) {
	try {
		const { data } = await axios.get(url)
		return data;
	}
	catch (error) {
		throw new Error(`Failed to get messages: ${error}`);
	}
}

export async function getChMessages(id: string) {
	let idNum = Number(id);
	const res = await axios.get(`/channel/messages/${idNum}`, {
        withCredentials: true,
      });

	return res.data
}

