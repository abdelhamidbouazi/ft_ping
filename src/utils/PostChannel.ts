import axios from "@/app/api/axios";
import { Toast } from "flowbite-react";
import get_a_user_data from "./get_avatarofsomeone";

import { useEffect, useState } from "react";
export const postChannel = async (title: string, channelType: string, password: string | undefined) => {
	let data = {
	  title: title,
	  type: channelType,
	  password: channelType === 'protected' ? password : null
	};

	let config = {
	  method: 'post',
	  url: `/channel/createchannel/`,
	  withCredentials: true,
	  data: data
	};

	return axios.request(config)
	  .then((response) => {
		return response.data;
	  })
	  .catch((error) => {
		throw error;
	  });
  }

export const joinChannel = async (id: string, channelId: string, password: string, type: string) => {
	type Data  = {
		id?: string,
		channelId: string,
		password?: string
	};
	let data  = {
		channelId: channelId,
		Password: password
	};

	let config;
	if (type === "public" || type === "private"){
		config = {
		  method: 'post',
		  url: `/channel/joinprivate_public/${channelId}`,
		  withCredentials: true,
		
		};
	}
	else {
		config = {
		  method: 'post',
		  url: `/channel/join/protected`,
		  withCredentials: true,
		  data: data
		};
	}

	return axios.request(config)
	  .then((response) => {
		return response.data;
	  })
	  .catch((error) => {
		throw error;
	  });
  }

  export const InviteToChannel = async (channelId: string, username: string) => {
	const channelIdNum = parseInt(channelId);
	let userId;
    async function getIdByUsername() {
        const userData = await get_a_user_data(username).then((response) => {
			userId = response.id.toString();
		});
    }
	await getIdByUsername();
    let data  = {
        userId,
        channelId: channelIdNum,
    };
    let config;
    config = {
        method: 'post',
        url: `/channel/inviteuser/${channelId}`,
        withCredentials: true,
        data: data
    };
    return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export const BanFromChannel = async (channelId: string, uid: string) => {
	let data = {
		channelId: Number(channelId),
		userId: Number(uid)
	};

	let config = {
	  method: 'post',
	  url: `/administartion/ban`,
	  withCredentials: true,
	  data: data
	};

	return axios.request(config)
	  .then((response) => {
		return response.data;
	})
	  .catch((error) => {
		  throw error;
	  });
  }

export const UnBanFromChannel = async (channelId, uid) => {
	let data = {
		channelId: Number(channelId),
		userId: Number(uid)
	};

	let config = {
	  method: 'post',
	  url: `/administartion/unban`,
	  withCredentials: true,
	  data: data
	};

	return axios.request(config)
	  .then((response) => {
		return response.data;
	})
	  .catch((error) => {
		  throw error;
	  });
  }
  export const KickFromChannel = async (channelId, uid) => {
	  let data = {
		channelId: Number(channelId),
		userId: Number(uid)
	};
	let config = {
	  method: 'post',
	  url: `/administartion/kick`,
	  withCredentials: true,
	  data: data
	};

	return axios.request(config)
	  .then((response) => {
		return response.data;
	})
	  .catch((error) => {
		  throw error;
	  });
  }
export const AddAdmin = async (channelId, uid) => {
	let data = {
		channelId: Number(channelId),
		userId: Number(uid)
	};

	let config = {
	  method: 'post',
	  url: `/administartion/admin`,
	  withCredentials: true,
	  data: data
	};

	return axios.request(config)
	.then((response) => {
		return response.data;
	})
	.catch((error) => {
		  throw error;
	  });
	}
  export const RemoveAdmin = async (channelId, uid) => {
	  let data = {
		  channelId: Number(channelId),
		  userId: Number(uid)
		};

		let config = {
			method: 'delete',
			url: `/administartion/unadmin`,
			withCredentials: true,
			data: data
		};

		return axios.request(config)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
	}

	export const MuteUser = async (channelId, uid, duration) => {
		let data = {
			channelId: Number(channelId),
			userId: Number(uid),
			duration: Number(duration)
		};

		let config = {
		  method: 'post',
		  url: `/administartion/mute`,
		  withCredentials: true,
		  data: data
		};

		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }
	export const UnMuteUser = async (channelId, uid) => {
		let data = {
			channelId: Number(channelId),
			userId: Number(uid),
		};

		let config = {
		  method: 'post',
		  url: `/administartion/unmute`,
		  withCredentials: true,
		  data: data
		};

		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }
	export const LeaveChannel = async (channelId) => {

		let data = {
			channelId: Number(channelId)
		};
		let config = {
		  method: 'post',
		  url: `/channel/leavechannel`,
		  withCredentials: true,
		  data: data
		};

		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }
	export const DeleteChannel = async (channelId) => {

		let data = {
			channelId: Number(channelId)
		};
		let config = {
		  method: 'delete',
		  url: `/administartion/deletechannel`,
		  withCredentials: true,
		  data: data,
		};

		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }

	export const AcceptInvite = async (channelId) => {
		let config = {
		  method: 'post',
		  url: `/channel/acceptInvit/${channelId}`,
		  withCredentials: true,
		};
	
		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }
	export const DeclineInvite = async (channelId) => {
		let config = {
		  method: 'post',
		  url: `/channel/rejectedInvit/${channelId}`,
		  withCredentials: true,
		};
	
		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }
	export const updateTitle = async (channelId, updatedTitle) => {
		let data = {
			channelId: Number(channelId),
			title: updatedTitle
		};

		let config = {
		  method: 'put',
		  url: `/administartion/updatetitle`,
		  withCredentials: true,
		  data: data,
		};
	
		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }
	export const updateType = async (channelId, updatedType, updatedPassword) => {
	
		let data = {
			channelId: Number(channelId),
			type: updatedType,
			password: (updatedType === 'protected' ? updatedPassword : null)
		};


		let config = {
		  method: 'put',
		  url: `/administartion/updatetype`,
		  withCredentials: true,
		  data: data,
		};
	
		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }
	export const updatePassword = async (channelId, updatePassword) => {
		let data = {
			channelId: Number(channelId),
			password: updatePassword,
			
		};

		let config = {
		  method: 'put',
		  url: `/administartion/updatepassword`,
		  withCredentials: true,
		  data: data,
		};
	
		return axios.request(config)
		  .then((response) => {
			return response.data;
		})
		  .catch((error) => {
			  throw error;
		  });
	  }