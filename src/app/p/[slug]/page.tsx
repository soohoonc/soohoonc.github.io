export const dynamicParams = false;

export function generateStaticParams() {
  const projects = [{ slug: 'test' }, { slug: '8bit' }, { slug: 'reviewr' }, { slug: 'tabnam' }];
  return projects;
}

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

const Page = ({ params }: ProjectPageProps) => {
  const { slug } = params;
  return (
    <div>
      <h2>{slug}</h2>
    </div>
  );
};

export default Page;
