import { File } from '@/components/file'

export const generateStaticParams = async () => {
    const paths = [{
        path: [''],
    }]

    return paths
}

interface PageProps {
    params: {
        path: string[]
    }
}

const Page = ({ params }: PageProps) => {
  const { path } = params
  console.log(path)
  return (
    <File />
  )
}

export default Page