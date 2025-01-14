'use client';

import { Avatar, AvatarBadge} from '@chakra-ui/react'
import Link from 'next/link';

interface SelectedUserHeaderProps {
	avatarURL: string;
	username: string;
	fullName: string;
}

const SelectedUserHeader: React.FC<SelectedUserHeaderProps> = ({ avatarURL, username, fullName }) => {
	return (
		<div
			className="flex flex-row items-center bg-midnight border border-midnight-border py-4 px-6 rounded-lg">

			<div className=" rounded-full ">
				<Link href={`/users/${username}`}>
					<Avatar name={fullName} src={avatarURL}>
						<AvatarBadge boxSize='1em' bg='green.500' />
					</Avatar>
				</Link>
			</div>
			<div className="flex flex-col items-start px-6">
			{username !== null && 
					<Link href={`/users/${username}`}>
				<div className="text-sm font-semibold text-midnight-secondary">{fullName}</div>
						<div className="text-xs text-midnight-light">@{username}</div>
					</Link>
			}
			</div>
		</div>
	);
}

export default SelectedUserHeader;
