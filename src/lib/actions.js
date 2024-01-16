'use server'
import { revalidatePath } from "next/cache"
import { v2 as cloudinary } from 'cloudinary';
import process from 'node:process'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadFile(formData) {
    const file = formData.get('file')

    const fileBuffer = await file.arrayBuffer();

    let mime = file.type;
    let encoding = 'base64';
    let base64Data = Buffer.from(fileBuffer).toString('base64');
    let fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    try {

        const result = await cloudinary.uploader.upload(fileUri, {
            invalidate: true,
            folder: "galeria",
            public_id: file.name,
            // LO SIGUIENTE PUESTO EN COMENTARIOS SOLO LO USAMOS PARA RECORTAR LA IMAGEN AL SUBIRLA SI QUEREMOS
            // aspect_ratio: "1.62",
            // width: 600,
            // crop: "fill",
            gravity: "center"
        })

        revalidatePath('/')

        return { type: 'success', message: 'Archivo subido' }

    } catch (error) {
        return { type: 'error', message: error.message }
    }
}

export async function mostrar() {
    const result = cloudinary.api.resources({
        max_results: 500,
        type: 'upload',
        prefix: 'galeria/'
    })
    revalidatePath('/')

    return result
}

export async function fileDelete(formData) {
    let publicId = formData.get('id')

    try {
        const result = await cloudinary.uploader.destroy(`${publicId}`, {
            folder: 'galeria'
        })
        revalidatePath('/')

        return { type: 'success', message: 'Archivo eliminado' }

    } catch {
        return { type: 'error', message: error.message }
    }
}

export async function fileUpdate(formData) {
    const publicId = formData.get('id')
    const file = formData.get('updatefile')

    const fileBuffer = await file.arrayBuffer();

    let mime = file.type;
    let encoding = 'base64';
    let base64Data = Buffer.from(fileBuffer).toString('base64');
    let fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
    console.log(publicId);

    try {

        const result = await cloudinary.uploader.upload(fileUri, {
                    invalidate: true,
                    public_id: publicId
                })

        let imageUrl = result.secure_url;
        revalidatePath('/')

        return { type: 'success', message: 'Archivo actualizado' }

    } catch (error) {
        return { type: 'error', message: error.message }
    }
}

export async function nextImg(imagenes, indice) {
    let url = '';
    if (indice != -1 && indice != imagenes.length - 1) {
        url = imagenes[indice + 1].secure_url
    } else if (indice == imagenes.length - 1) {
        url = imagenes[0].secure_url
    }
    return url
}

export async function prevImg(imagenes, indice) {
    let url = '';
    if (indice != -1 && indice > 0) {
        url = imagenes[indice - 1].secure_url
    } else if (indice == 0) {
        url = imagenes[imagenes.length - 1].secure_url
    }
    return url
}

export async function searchImg(src, id) {
    let resultados = await searchIndex(src)
    let indice = resultados.indice
    let imagenes = resultados.imagenes
    let mov = id
    let url = ''
    mov === 'anterior' ? url = prevImg(imagenes, indice) : url = nextImg(imagenes, indice)
    return url
}

export async function searchIndex(src) {
    let result = await mostrar()
    let imagenes = result.resources
    let urlInicio = src
    let indice = imagenes.findIndex(img => img.secure_url === urlInicio)
    return { indice, imagenes }
}

export async function totalFiles() {
    let result = await mostrar()
    let imagenes = result.resources
    let contador = imagenes.length
    return contador
}
