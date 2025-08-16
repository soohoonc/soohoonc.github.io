type Node = {
  name: string
  type: 'directory' | 'file'
  children?: Node[]
  content?: React.ReactNode
}

export const fs: Node[] = [
  {
    name: "home",
    type: "directory",
    children: [
      {
        name: "soohoon",
        type: "directory",
        children: [

          {
            name: "welcome",
            type: "file",
            content: (
              <div className="flex flex-col w-full p-2">
                <h1>hi i&apos;m soohoon</h1>
                <br />
                <p>
                  i&apos;m currently running <a href="https://greptile.com" target="_blank" className="text-green-500 underline">greptile</a> as cofounder and cto
                  <br />
                  before that I was a computer science and math student at <a href="https://gatech.edu" target="_blank" className="text-amber-700 underline">georgia tech</a>
                  <br />
                  i live in <a href="https://maps.apple.com/place?auid=8077516530309122779" target="_blank" className="underline text-red-500">san francisco</a>
                  <br />
                  i <a href="https://www.instagram.com/soohoon.art" target="_blank" className="underline text-blue-500">draw sometimes</a> (kinda on hiatus right now)
                  <br />
                  naturally here is my <a href="https://soohoonchoi.substack.com" className="underline text-orange-500" target="_blank">substack</a>
                  <br />
                  i angel invest small amounts (i.e. <a href="https://better-auth.com" className="underline" target="_blank">better-auth</a>, <a href="https://www.prismreplay.com/" target="_blank" className="underline">prism</a>, <a href="https://joinsecondnature.com" className="underline" target="_blank">poppy</a>, etc.)
                </p>
                <br />
                <p>contact</p>
                <ul>
                  <li>- <a href="https://x.com/soohoonchoi" target="_blank" className="text-blue-500 underline">twitter/x</a></li>
                  <li>- <a href="https://github.com/soohoonc" target="_blank" className="text-blue-500 underline">github</a></li>
                  <li>- <a href="https://linkedin.com/in/soohoonchoi" target="_blank" className="text-blue-500 underline">linkedin</a></li>
                  <li>- email: soohoonchoi [at] gmail [dot] com</li>
                </ul>
              </div >
            )
          },
          {
            name: "readme",
            type: "file",
            content: (
              <div className="flex flex-col w-full p-2">
                <h1>wait this is not accurate?</h1>
                <br />
                <p>
                  are you worried that this site isn&apos;t truly faithful to any actual classic mac os?
                  <br />
                  you&apos;re telling me finder didn&apos;t work this way back then?
                  <br />
                  macs did&apas;t have terminals until os x?
                  <br />
                  this is not a real os, it&apos;s a <span className="italic font-bold">vibe</span>
                </p>
              </div>
            )
          }
        ]
      }
    ]
  }
]