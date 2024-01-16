'use client'
import { uploadFile } from "@/lib/actions";
import { toast } from 'react-hot-toast';
import { dragOverHandler, dropHandler } from "@/lib/dragAndDrop";

const UploadForm = ({ img }) => {

  img = 'image.png';

  async function wrapper(data) {
    const { type, message } = await uploadFile(data)
    let volverImg = document.getElementById('imgPreview')
    volverImg.src = 'image.png'
    if (type == 'success') toast.success(message)
    if (type == 'error') toast.error(message)
  }

  return (
      <form id='subida' action={wrapper} style={{ padding: '5px' }}>
      <h1>Subir archivo</h1>
        <img
          id='imgPreview'
          src={img}
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          style={{
            display: 'block',
            aspectRatio: 1.62,
            width: '324px',
            height: '200px',
            objectFit: 'cover',
            objectPosition: 'center',
            marginBottom: '5px'
          }} />
        <input type="file" name="file" accept="image/*" style={{ display: 'none' }} />
        <button formAction={wrapper}>Subir</button>
      </form>
  );
};

export default UploadForm;
