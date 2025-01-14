import React from "react";
import Profile from "./Profile";
import Friends from "./Friends";
import Chat from "./Chat";

const MainCard = () => {
	return (
		<div className="flex w-full h-[85%] flex-col lg:flex-row gap-y-4  pt-3">
			<div className="w-full pr-4">
				<Profile />
			</div>
			<div className="flex flex-col sm:flex-row lg:flex-col lg:w-[30%] pr-4 gap-4 ">
				<Friends />
				<Chat />
			</div>
		</div>
	);
};

export default MainCard;
