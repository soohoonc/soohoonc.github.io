export const fs = {
  user: {
      type: 'directory',
      children: {
        soohoonchoi: {
          type: 'directory',
          children: {
            about: {
              type: 'file',
              content: (
                <p>
                  <a className='link' target='_blank' href='https://bento.me/soohoonchoi'>
                    soohoonchoi
                  </a>
                  <br />i am a cofounder over at{' '}
                  <a className='link' target='_blank' href='https://getonboardai.com'>
                    onboard ai
                  </a>
                  .<br />
                  recently graduated from{' '}
                  <a className='link' target='_blank' href='https://www.gatech.edu/'>
                    gt
                  </a>{' '}
                  with a degree in math and cs.
                  <br />i also like to{' '}
                  <a className='link' target='_blank' href='https://instagram.com/soohoon.art'>
                    art
                  </a>
                </p>
              ),
            },
            credits: {
              type: 'file',
              content: (
                <p>
                  <a className='link' target='_blank' href='https://bento.me/soohoonchoi'>
                    soohoonchoi
                  </a>
                </p>
              ),
            },
            help: {
              type: 'file',
              content: (
                <ul>
                  <li>[command]: [description]</li>
                  <li key={0} className='flex flex-row'>
                    <span className='ml-[1ch] w-[8ch]'>about</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>about me</span>
                  </li>
                  <li key={1} className='flex flex-row'>
                    <span className='ml-[1ch] w-[8ch]'>resume</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>view my resume</span>
                  </li>
                  <li key={2} className='flex flex-row'>
                    <span className='ml-[1ch] w-[8ch]'>timeline</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>some of my notable moments</span>
                  </li>
                  <li key={3} className='flex flex-row'>
                    <span className='ml-[1ch] w-[8ch]'>source</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>view the source code</span>
                  </li>
                  <li key={4} className='flex flex-row'>
                    <span className='ml-[1ch] w-[8ch]'>clear</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>clear the terminal</span>
                  </li>
                  <li key={5} className='flex flex-row'>
                    <span className='ml-[1ch] w-[8ch]'>(+ more)</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>try stuff, in the works</span>
                  </li>
                </ul>
              ),
            },
            license: {
              type: 'file',
              content: (
                <p>
                  <a className='link' target='_blank' href='https://opensource.org/license/mit/'>
                    MIT
                  </a>
                </p>
              ),
            },
            projects: {
              type: 'directory',
              children: {},
            },
            resume: {
              type: 'file',
              content: (
                <p>
                  <a
                    className='link'
                    target='_blank'
                    href='https://github.com/soohoonc/soohoonc.github.io'
                  >
                    github
                  </a>
                </p>
              ),
            },
            source: {
              type: 'file',
              content: (
                <p>
                  <a
                    className='link'
                    target='_blank'
                    href='https://github.com/soohoonc/soohoonc.github.io'
                  >
                    github
                  </a>
                </p>
              ),
            },
            timeline: {
              type: 'file',
              content: (
                <ul>
                  <li>
                    <span className='w-[5ch]'>[time]:</span>
                    <span className='ml-[1ch] w-[16ch]'>[location]</span>
                    <span className='ml-[5ch]'>: [event]</span>
                  </li>
                  <li key={0} className='flex flex-row'>
                    <span className='ml-[1ch] w-[5ch]'>1998</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch] w-[14ch]'>
                      <a
                        className='link'
                        target='_blank'
                        href='https://www.google.com/maps/place/seoul'
                      >
                        seoul
                      </a>
                    </span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>born</span>
                  </li>
                  <li key={1} className='flex flex-row'>
                    <span className='ml-[1ch] w-[5ch]'>2001</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch] w-[14ch]'>
                      <a
                        className='link'
                        target='_blank'
                        href='https://www.google.com/maps/place/makati'
                      >
                        makati
                      </a>
                    </span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>move to philippines</span>
                  </li>
                  <li key={2} className='flex flex-row'>
                    <span className='ml-[1ch] w-[5ch]'>2018</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch] w-[14ch]'>
                      <a className='link' target='_blank' href='https://www.faith.edu.ph'>
                        faith academy
                      </a>
                    </span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>graduate highschool</span>
                  </li>
                  <li key={3} className='flex flex-row'>
                    <span className='ml-[1ch] w-[5ch]'>2018</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch] w-[14ch]'>
                      <a
                        className='link'
                        target='_blank'
                        href='https://www.google.com/maps/place/atlanta'
                      >
                        atlanta
                      </a>
                    </span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>move to us</span>
                  </li>
                  <li key={3} className='flex flex-row'>
                    <span className='ml-[1ch] w-[5ch]'>2019</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch] w-[14ch]'>
                      <a className='link' target='_blank' href='https://www.gatech.edu'>
                        georgia tech
                      </a>
                    </span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>start college</span>
                  </li>
                  <li key={3} className='flex flex-row'>
                    <span className='ml-[1ch] w-[5ch]'>2023</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch] w-[14ch]'>
                      <a className='link' target='_blank' href='https://www.gatech.edu'>
                        georgia tech
                      </a>
                    </span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>graduate college</span>
                  </li>
                  <li key={3} className='flex flex-row'>
                    <span className='ml-[1ch] w-[5ch]'>2023</span>
                    <span>{': '}</span>
                    <span className='ml-[2ch] w-[14ch]'>
                      <a
                        className='link'
                        target='_blank'
                        href='https://www.google.com/maps/place/sanfrancisco'
                      >
                        san francisco
                      </a>
                    </span>
                    <span>{': '}</span>
                    <span className='ml-[2ch]'>startups full time</span>
                  </li>
                </ul>
              ),
            },
          },
        },
      },
    },
};
