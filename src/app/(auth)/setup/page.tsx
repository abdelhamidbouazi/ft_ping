"use client";
import { useState, useEffect, useContext } from "react";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/app/api/axios";
import get_me_fromClient from "@/utils/GET_me";
import io from "socket.io-client";
import { Avatar } from "@chakra-ui/react";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { DataContext } from "@/components/Play/context";

export default function Profile() {
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [displayname, setDisplayname] = useState<string>("");
  const [displayname_up, setDisplaynameup] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [nickname_updated, setNicknameuptodate] = useState<string>("");

  const [file, setFile] = useState<File>(null);
  function handleDisplayname(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplayname(e.target.value);
  }

  function handleNickname(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
  }
  async function handlSaveChanges() {
    
    const socket = io(`http://${process.env.NEXT_PUBLIC_IP_FRONT}`, {
    withCredentials: true,
  });
    try {
      if(socket === null) return;
      socket.on("update_is_done", () => {
        axios
        .get("/users/me")
        .then(({ data }) => {
          setNicknameuptodate(data.nickname);
          setDisplaynameup(data.displayName);
        })
        toast.success("Update is done",
        {
            toastId: 'success1'
        })
      });
      if (file && file.type !== "image/jpeg" && file.type !== "image/png") {
        
        toast.error("Image format is incorrect",
        {
            toastId: 'error1'
        })
        return;
      }
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
          const response = await axios.post("/users/file_upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setImage(URL.createObjectURL(file));
      }
      const displaynameData = JSON.stringify({
        displayname: displayname,
      });
      const nicknameData = JSON.stringify({
        nickname: nickname,
      });

      if (displayname.length > 0) {
        await axios.post("/users/displayname_update", displaynameData, {
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
          },
        }).catch(() => {
         
            throw new Error("invalid displayname");
        })
      }
      if (nickname.length > 0) {
        const resp =await axios.post("/users/nickname_update", nicknameData, {
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
          },
        });
        if(resp.status === 400){
          throw new Error("invalid nickname");
        }
      }
      router.push("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
        {
            toastId: 'error1'
        })
    }
    socket.disconnect();
  }

  

  useEffect(() => {
    axios
      .get("/users/me")
      .then(({ data }) => {
        setNicknameuptodate(data.nickname);
        setDisplaynameup(data.displayName);
      })
      .catch((err) => {});
  }, []);
  const handleFileChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const [me, set_ME] = useState([]);

  useEffect(function () {
    async function get_data_of_me() {
      const user = await get_me_fromClient();
      setImage(user.Avatar_URL);
      set_ME(user);
    }
    get_data_of_me();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-20 h-screen shadow-md offset-md-[15px] offset-[15px] relative items-center w-[50%] rounded-lg">
        <h1 className="text-lg font-bold text-midnight-secondary">Edit Profile</h1>
        <div className="relative">
        <Avatar src={image} size="2xl" />
          <form className="absolute bottom-0 left-[70%]" onSubmit={handleSubmit}>
            <label htmlFor="fileInput">
              <div className="rounded-full text-midnight-light bg-midnight-border">
                <Icon
                  icon="akar-icons:camera"
                  width="30"
                  height="30"
                  className="cursor-pointer"
                />
              </div>
              <input
                className="hidden"
                type="file"
                name="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </form>
        </div>
          <div className="flex flex-col text-base text-midnight-secondary">
          <p className="text-xl pr-4">{displayname_up}</p>
          <p className="text-xl pr-4">{nickname_updated}</p>
          </div>
        <div className="w-full flex flex-col md:flex-row gap-20 justify-center items-center mb-6">
          <div>
            <label
              htmlFor="Fullname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Change your Fullname:
            </label>
            <input
              type="text"
              onChange={handleDisplayname}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Your Fullname"
              required
              
            />
          </div>
          <div>
            <label
              htmlFor="Nickname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Change your Nickname:
            </label>
            <input
              type="text"
              onChange={handleNickname}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Your Nickname"
              required
            />
          </div>
        </div>
        <div className=" flex items-center">
          <button
            type="submit"
            className=" text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-green-800 shadow-green-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handlSaveChanges}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
