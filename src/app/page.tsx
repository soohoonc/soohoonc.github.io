const Page = () => {
  return (
    <div>
     <h1>Soohoon Choi</h1>
     <h3 className="mb-2">about me</h3>
     <p className="my-2">
      Cofounder at <a href="https://greptile.com">Greptile</a>.<br/>
      Georgia Tech computer science and mathematics class of 2023.
      </p>
      Interested in (but not limited to):
      <ul className="m-2">
        <li>ai</li>
        <li>knowledge graphs</li>
        <li>art</li>
        <li>most subjects tbh</li>
      </ul>
     {/* <h3 className="mb-0">blog</h3>
      <ul className="mt-0">
        <li><a href="https://soohoonchoi.com">soohoonchoi.com</a></li>
      </ul> */}
    <h3 className="mb-2">contact</h3>
     <div className="flex flex-row space-x-2">
        <div><a href="https://github.com/soohoonc">Github</a></div>
        <div><a href="https://linkedin.com/in/soohoonchoi">LinkedIn</a></div>
        <div><a href="https://twitter.com/soohoonchoi">Twitter</a></div>
     </div>
    </div>
  )
}

export default Page