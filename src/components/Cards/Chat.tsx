"use client";
import React from "react";
import Contchat from "./Contchat";

const Chat = () => {
	return (
<div className="w-full h-5/6 lg:h-1/2 text-white rounded-lg border border-midnight-border hover:bg-midnight">
			<p className="text-2xl px-8 p-5 font-normal">Chat</p>
			<div className="flex flex-col gap-1 h-[80%] rounded-lg overflow-y-scroll  px-3 scrollbar-thumb-midnight-secondary scrollbar-[#3E5C76] scrollbar-thin">
			<Contchat />
			</div>
		</div>
	);
};

export default Chat;

