import React, { useState, useEffect }from "react";

import "./styles.css";

import api from './services/api';

function App() {
  
  const [ repositories, setRepository ] = useState([]);
  // When the page is loaded, useEffect send a get request to 
  // localhost:3333/repositories and populate the 'const repositories'
  // with the response data.
  useEffect(
    () => {
      api.get('repositories').then( response => {setRepository(response.data)});
    },
    [ ]);

  async function handleAddRepository() {
    //Use axios to send a post request to localhost:3333/repositories with
    // the new repository data in the body. When the response return
    // insert that data into 'setRepository' respecting the React immutability
    api.post('repositories',
    {
      title: `Novo repositório ${Date.now()}`,
      url: "https://github.com/muriloportugal",
      techs: ["Nodejs","ReactJS"],
      likes:0
    }).then( response => {setRepository([...repositories,response.data])});
  }

  async function handleRemoveRepository(id) {
    // Send a delete request with the id of the repository, and when the response
    // returns verify if the status is 204, proving the repository was already
    // deleted in our back-end, then we can delete from 'const repositories'
    // and recreate it with 'setRepository' respecting the React immutability
    api.delete(`repositories/${id}`).then( response =>{
      if(response.status===204){
        const repositoryIndex = repositories.findIndex(repository => repository.id === id);
        repositories.splice(repositoryIndex,1);
        setRepository([...repositories])
      }
    });
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {
          //return each element in repositories array and create the list at HTML page
          // each element has its on button to remove.
          repositories.map(repository => (
            <li key={repository.id}> {repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          ))
        }

      </ul>
      
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
