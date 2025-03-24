

interface FinderProps {
  path?: string;
}

const Finder = ({ path = '/home/soohoon' }: FinderProps) => {

  return (
    <div>
      <h1>Finder</h1>
      <p>{path}</p>
    </div>
  );
}

export default Finder;