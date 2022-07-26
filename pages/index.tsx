import React from 'react'
import Head from 'next/head'
import { createFilter } from 'react-search-input'
import { Input, Header, Divider, Label, Icon, Button } from 'semantic-ui-react'
import siteData from '../site-data.json'
import ProjectCard from '../components/ProjectCard'
import FilterSelect from '../components/FilterSelect'
import TagButton from '../components/TagButton'

const { projects, keywords, domains, fileExtensions } = siteData

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResult, setSearchResult] = React.useState(projects)
  const [selectedKeywords, setSelectedKeywords] = React.useState([])
  const [selectedDomains, setSelectedDomains] = React.useState([])
  const [selectedFileExtensions, setSelectedFileExtensions] = React.useState([])

  React.useEffect(() => {
    const handleKeydown = event => {
      const searchInput = document.getElementsByClassName('searchInput')[0]
        .firstElementChild as HTMLInputElement
      //lose focus when pressing enter key, for mobile
      if (event.which == 13) {
        searchInput.blur()
      }
    }
    document
      .getElementsByClassName('searchInput')[0]
      .firstElementChild.addEventListener('keydown', handleKeydown)
  }, [])

  let timeout = null
  React.useEffect(() => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const filter = createFilter(searchTerm, [
        'title',
        'description',
        'licensor.name',
      ])
      let result = projects.filter(filter)
      if (selectedKeywords.length > 0) {
        result = result.filter(p =>
          selectedKeywords.reduce((acc, k) => acc && p.keywords?.includes(k), true),
        )
      }
      if (selectedDomains.length > 0) {
        result = result.filter(p => selectedDomains.includes(p['source-domain']))
      }
      if (selectedFileExtensions.length > 0) {
        result = result.filter(p => {
          return p.fileExtensions.some(ext => selectedFileExtensions.includes(ext))
        })
      }
      setSearchResult(result)
    }, 100)
  }, [
    searchTerm,
    selectedKeywords.toString(),
    selectedDomains.toString(),
    selectedFileExtensions.toString(),
  ])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="main">
        <>
          <Head>
            <title>Open Know-How Search</title>
            <link rel="icon" type="image/png" href="favicon.png" />
          </Head>
          {
            <>
              <div className="top">
                <a href="https://internetofproduction.org/open-know-how">
                  <div className="logo">
                    <img src="logo.svg" />
                    <Header as="h1" style={{ marginTop: 0 }}>
                      Open Know-How
                    </Header>
                  </div>
                </a>
                <div className="search">
                  <Input
                    fluid
                    size="huge"
                    placeholder="Search..."
                    onChange={e => setSearchTerm(e.target.value)}
                    className="searchInput"
                  />
                </div>
              </div>
              <div
                style={{
                  width: 'min(920px, 92%)',
                }}
              >
                <Divider />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: 'min(920px, 92%)',
                  }}
                >
                  <Header>Filters: </Header>
                  <div style={{ marginLeft: 20 }}>
                    {selectedKeywords
                      .concat(selectedDomains)
                      .concat(selectedFileExtensions)
                      .map(kw => {
                        return <TagButton icon="x">{kw}</TagButton>
                      })}
                  </div>
                </div>
                <Divider />
              </div>
              <div style={{ marginTop: 50 }} className="filter">
                <Header sub size="large">
                  Keywords
                </Header>
                <div className="filter-select">
                  <FilterSelect options={keywords} onChange={setSelectedKeywords} />
                </div>
              </div>
              <div className="filter">
                <Divider />
                <Header sub size="large">
                  Sources
                </Header>
                <div className="filter-select">
                  <FilterSelect options={domains} onChange={setSelectedDomains} />
                </div>
              </div>
              <div className="filter">
                <Divider />
                <Header sub size="large">
                  Files
                </Header>
                <div className="filter-select">
                  <FilterSelect
                    options={fileExtensions}
                    onChange={setSelectedFileExtensions}
                  />
                </div>
                <Divider />
              </div>
              <div>
                <div id="projects">
                  {searchResult.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                  {searchResult.length === 0 && (
                    <p
                      style={{
                        color: '#444444',
                        marginTop: 60,
                        marginBottom: 100,
                        fontSize: '15pt',
                      }}
                    >
                      Sorry, no results.
                    </p>
                  )}
                </div>
              </div>
            </>
          }
        </>
      </div>
      <style jsx>{`
        .main {
          display: flex;
          max-width: 1200px;
          flex-direction: column;
          min-width: min(100%, 1200px);
          justify-content: center;
          align-items: center;
        }

        .top {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          justify-content: center;
          align-items: center;
        }

        .logo {
          padding: 20px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        }

        .logo img {
          width: 200px;
        }

        @media (min-width: 550px) {
          .search {
            width: 500px;
          }
        }

        @media (max-width: 550px) {
          .search {
            width: 80vw;
          }
        }

        .filter {
          width: min(900px, 90%);
        }

        .filter-select {
          margin-left: 100px;
        }

        @media (max-width: 880px) {
          .filter {
            display: flex;
            flex-direction: column;
          }
          .filter-select {
            margin-left: 0px;
          }
        }

        #projects {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
