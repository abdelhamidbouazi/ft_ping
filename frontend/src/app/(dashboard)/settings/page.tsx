"use client";
import { useState, useEffect, useContext } from "react";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/app/api/axios";
import get_me_fromClient from "@/utils/GET_me";
import { Avatar } from "@chakra-ui/react";
import Twofact from "@/components/Cards/2fa/TwoFact";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { DataContext } from "../../../components/Play/context";

export default function Profile() {

  const {globalSocket} = useContext(DataContext);

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
    if(globalSocket === null) return;
    try {
      
      globalSocket.on("update_is_done", () => {
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

      


      if (file && file.size > 1024 * 1024) {
        toast.error("Image size is too large",
        {
            toastId: 'error1'
        })
        return;
      }

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
          setImage(URL?.createObjectURL(file));
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
        }).catch((error) => {;
            throw new Error(error.response.data.message);
        })
      }
      if (nickname.length > 0) {
        const resp =await axios.post("/users/nickname_update", nicknameData, {
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
          },
        }).catch((error) => {;
          throw new Error(error.response.data.message);
      })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message,
        {
          toastId: 'error1'
      })
    }
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
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      const blob = new Blob([file], { type: file.type });
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      setFile(file);
    } else {
      console.log("No file selected");
    }
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
          <p className="text-xl pr-4">@{nickname_updated}</p>
          </div>
        <div className="w-full flex flex-col md:flex-row gap-20 justify-center items-center mb-6">
          <div>
            <label
              htmlFor="Fullname"
              className="block mb-2 text-sm text-midnight-light font-medium text-gray-900"
            >
              Change your FullName:
            </label>
            <input
              type="text"
              onChange={handleDisplayname}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Your FullName"
              required
              
            />
          </div>
          <div>
            <label
              htmlFor="Nickname"
              className="block mb-2 text-sm text-midnight-light font-medium text-gray-900 dark:text-white"
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
        <Twofact />
        <div className=" flex items-center">
          <button
            type="submit"
            className=" rounded-lg text-midnight-secondary border border-midnight-border  font-normal hover:bg-midnight-secondary hover:text-midnight-light active:bg-violet-700 focus:outline-none text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handlSaveChanges}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
