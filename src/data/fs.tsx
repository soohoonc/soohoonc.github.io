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
                <h1>Hi, I am Soohoon Choi</h1>
                <br />
                <p>
                  I&apos;m currently running <a href="https://greptile.com" className="text-green-500 underline">GREPTILE</a>, an AI code review company, as a cofounder.
                  Before that I was a CS and math student at <a href="https://gatech.edu" className="text-amber-700 underline">Georgia Tech</a> .
                </p>
                <br />
                <p>
                  I am based in <span className="text-red-500">🌉 San Francisco</span>, but before I lived in:
                </p>
                <ul>
                  <li>- Atlanta</li>
                  <li>- Manila</li>
                  <li>- Seoul</li>
                </ul>
                <br />
                <p>
                  Feel free to reach me out at:
                  <br />
                  soohoonchoi [at] gmail [dot] com
                </p>
              </div>
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