import { mostrar } from '@/lib/actions'
import UploadForm from '@/components/UploadForm'
import Galeria from '@/components/galeria'

export default async function Home() {
  let result = await mostrar()
  return (
    <main>
      <UploadForm/> 
      <Galeria  result={result}/>
    </main>
  )
}
