// import { useRouter } from 'next/router'
import { getPage, getPages } from '@/lib/mdxUtils'
// import { useShell } from '@/providers/shell'


export async function generateStaticParams() {
    const slug = getPages().map(file => file.slug)  
    return slug.map(slug => ({
        params: { slug: slug.split('/') }
    }))
}

const Page = async ({ params }: {
    params: {
        slug: string[]
    }
}) => {
//   const router = useRouter()
//   const { execute } = useShell()

//   if (router.isFallback) {
//     return <div>Loading...</div>
//   }

//   // Function to handle file navigation
//   const navigateToFile = (filepath: string) => {
//     router.push(`/${filepath}`)
//   }

  // Function to edit file
//   const editFile = async (filepath, content) => {
//     const result = await execute(`echo "${content}" > ${filepath}`)
//     // Refresh the page or update state as needed
//   }

const slug = params.slug.join('/')
// const content = await getPage(`${slug}.md`)

  return (
    // <div>
    //   <MDXRemote {...source} />
    //   {/* Add navigation and edit controls here */}
    // </div>\
    <div>
      {slug}
    </div>
  )
}

export default Page

// export async function getStaticPaths() {
//   const paths = getMdxFiles().map(file => ({
//     params: { slug: file.slug.split('/') }
//   }))

//   return { paths, fallback: false }
// }

// export async function getStaticProps({ params }) {
//   const slug = params.slug.join('/')
//   const mdxFiles = getMdxFiles()
//   const file = mdxFiles.find(f => f.slug === slug)

//   if (!file) {
//     return { notFound: true }
//   }

//   const source = await getMdxContent(file.filepath)
//   const mdxSource = await serialize(source)

//   return { props: { source: mdxSource } }
// }