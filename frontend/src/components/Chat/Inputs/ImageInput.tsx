import { Button, Image } from '@nextui-org/react';
import axios from '../../../app/api/axios';

import React from 'react'
import { toast } from 'react-toastify';


export default function InputImage({channelId, close}) {
	const [selectedImage, setSelectedImage] = React.useState("");
	const [selectedFile, setSelectedFile] = React.useState<File>();
	const [uploading, setUploading] = React.useState(false);

	const handleUpload = async () => {
    setUploading(true);
		try {
      if (!selectedFile) {
        toast.info('select image', 
		{
			toastId: 'info1'
		});
        setUploading(false);
        return;
      }
      if (channelId === undefined) {
        toast.info('undifined channel id',
		{
			toastId: 'info1'
		});
        setUploading(false);
        return;
      }
			const formData = new FormData();
			formData.append("avatar", selectedFile);
			const { data } = await axios.post(`/channel/upload/${channelId}`, formData);
			toast.success('Avatar Updated successfully',
			{
				toastId: 'success1'
			});
			close();
		} catch (error: any) {
			toast.error(error?.response?.data?.message || error.message,
			{
				toastId: 'error1'
			});
		}
		setUploading(false);
	};
  return (
	<div className="max-w-4xl mx-auto p-20 space-y-6">
		<label >
			<input type="file" hidden onChange={({target}) => {
				if (target.files && target.files.length > 0) {
					const file = target.files[0];
					const blob = new Blob([file], { type: file.type });
					setSelectedImage(URL.createObjectURL(blob));
					setSelectedFile(file);
				}
			}}/>
			<div className='w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer'>
				{selectedImage ? (            <Image
              isZoomed
              width={200}
              height={200}
              alt="Avatar"
              src={selectedImage}
              fallbackSrc="https://via.placeholder.com/300x200"
            />) :  (<span>select image</span>)}
			</div>
		</label>
    <Button color="default" onClick={handleUpload} isLoading={uploading}>
    {uploading ? "Uploading..." : "Upload"}
    </Button>
	</div>
  )
}