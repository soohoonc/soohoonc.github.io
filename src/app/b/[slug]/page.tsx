export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: 'test' }];
}

interface BlogPageProps {
  params: {
    slug: string;
  };
}

const Page = ({ params }: BlogPageProps) => {
  const { slug } = params;
  return (
    <div>
      <h2>{slug}</h2>
    </div>
  );
};

export default Page;