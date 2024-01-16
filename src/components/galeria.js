'use client'
import { fileUpdate, fileDelete, searchImg, searchIndex, totalFiles } from '@/lib/actions'
import { toast } from 'react-hot-toast';
import { dragOverHandler, dropHandler } from "@/lib/dragAndDrop";


async function Galeria({ result }) {

  async function updateWrapper(data) {
    const { type, message } = await fileUpdate(data)
    if (type == 'success') toast.success(message)
    if (type == 'error') toast.error(message)
  }

  async function deleteWrapper(data) {
    const { type, message } = await fileDelete(data)
    if (type == 'success') toast.success(message)
    if (type == 'error') toast.error(message)
  }

  async function fileView(ev) {
    let vistaPrevia = document.getElementById('vistaPrevia')
    let elemento = document.getElementById('vista')
    let galeria = document.getElementById('formularios')
    let subida = document.getElementById('subida')
    let contador = document.getElementById('contador')
    
    vistaPrevia.style.display = 'block'

    elemento.removeAttribute('src')
    elemento.src = ev.target.src

    galeria.style.opacity = 0.5
    subida.style.opacity = 0.5

    let buscador = await searchIndex(elemento.src)
    let posicion = buscador.indice + 1
    let total = await totalFiles();
    contador.innerHTML = `Imagen ${posicion}/${total}`
  }

  function fileClose() {
    let vistaPrevia = document.getElementById('vistaPrevia')
    let galeria = document.getElementById('formularios')
    let subida = document.getElementById('subida')

    vistaPrevia.style.display = 'none'
    galeria.style.opacity = 1
    subida.style.opacity = 1
  }

  async function searchFile(ev) {
    let imagen = document.getElementById('vista')
    let contador = document.getElementById('contador')
    let id = ev.target.id
    let src = imagen.src
    const otra = await searchImg(src, id);
    imagen.removeAttribute('src')
    imagen.src = otra
    let posicion = await searchIndex(imagen.src)
    let total = await totalFiles();
    contador.innerHTML = `Imagen ${posicion.indice +1}/${total}`
  }

  return (
    <>
      <div className='formularios' id='formularios'>
        <h1>Galería de imágenes</h1>
        {result.resources.map(r => (
          <div className='container' key={r.public_id}>
            <form name='imagen' id='mostrador'  >
              <input type="hidden" name="id" id="id" defaultValue={r.public_id} />
              <img id={r.public_id} name='foto' key={r.public_id} src={r.secure_url}
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onClick={fileView}
                style={{
                  display: 'block',
                  aspectRatio: 1.62,
                  width: '300px',
                  height: '250px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  marginBottom: '5px'
                }}
              />
              <input type="file" name="updatefile" accept="image/*" style={{ display: 'none' }} />
              <div className='botones'>
                <button formAction={updateWrapper}>Actualizar</button>
                <button formAction={deleteWrapper}>Eliminar</button>
              </div>
            </form>
          </div>
        ))}
      </div>
      <div id='vistaPrevia' name='vistaPrevia' className='vistaPrevia' style={{ display: 'none' }}>
        <img id='vista' name='vista' style={{
          display: 'block',
          aspectRatio: 1.62,
          width: '85%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          marginBottom: '5px'
        }} />
        <div className='operar'>
          <button id='anterior' onClick={searchFile} style={{ objectPosition: 'center' }}>ANTERIOR</button>
          <span id='contador'></span>
          <button id='siguiente' onClick={searchFile} style={{ objectPosition: 'center' }}>SIGUIENTE</button>
          <button onClick={fileClose} style={{ objectPosition: 'center' }}>CERRAR</button>
        </div>
      </div>

    </>
  )
}

export default Galeria