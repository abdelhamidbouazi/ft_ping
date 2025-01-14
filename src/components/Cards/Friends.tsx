"use client";
import React from "react";
import Content from "./Content";


const Friends = () => {
	return (
		<div className="w-full sm:mb-0 mb-8 h-5/6 lg:h-1/2 text-white rounded-lg bg-midnight border border-midnight-border">
			<p className="text-2xl px-8 p-5 font-normal">Friends</p>
			<div className="flex flex-col gap-1 h-[80%] rounded-lg overflow-y-scroll px-3 scrollbar-thumb-midnight-secondary scrollbar-[#3E5C76] scrollbar-thin">
			<Content />
			</div>
		</div>
	);
};

export default Friends;

