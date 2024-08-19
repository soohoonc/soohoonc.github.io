const Page = () => {
  return (
    <div className="w-full h-screen p-0 m-0">
      <h1>Soohoon Choi</h1>
      <h3 className="mb-2">about me</h3>
      <p className="my-2">
        Cofounder at <a href="https://greptile.com" target="_blank">Greptile</a>.<br/>
        Georgia Tech computer science and mathematics class of 2023.
        </p>
        Interested in (but not limited to):
        <ul className="m-2">
          <li>ai</li>
          <li>knowledge graphs</li>
          <li>art</li>
          <li>most subjects tbh</li>
        </ul>
      <h3 className="mb-2">blog</h3>
        coming soon
        {/* <ul className="m-2">
          <li><a href="/b/one-year-sf">one year in sf</a></li>
        </ul> */}
      {/* <h3 className="mb-2">fun</h3>
      <p className="my-2">
        type cmdk + k to get started
      </p> */}
      <h3 className="mb-2">contact</h3>
      <div className="flex flex-row space-x-2">
          <div><a href="https://github.com/soohoonc">Github</a></div>
          <div><a href="https://linkedin.com/in/soohoonchoi">LinkedIn</a></div>
          <div><a href="https://x.com/soohoonchoi">Twitter</a></div>
      </div>
    </div>
  )
}

export default Page