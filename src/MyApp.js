import React, {useState, useEffect} from 'react';
import Table from './Table';
import Form from './Form';
import axios from 'axios';

function MyApp() {
   const [characters, setCharacters] = useState([]);
    
   function removeOneCharacter (index) {
      const updated = characters.filter((character, i) => {
         return i !== index
      });
      makeDeleteCall(characters[index].id).then( result => {
         if (result && (result.status === 204 || result.status === 404))
            setCharacters(updated);
            return result.data;
      });
   }

   function updateList(person) {
      makePostCall(person).then( result => {
         if (result && result.status === 201)
            setCharacters([...characters, person]);
            return result.data;
      });
   }

   async function fetchAll(){
      try {
         const response = await axios.get('http://localhost:2000/users');
         return response.data.users_list;     
      }
      catch (error){
         //We're not handling errors. Just logging into the console.
         console.log(error); 
         return false;         
      }
   }

   async function makePostCall(person){
      try{
         const response = await axios.post('http://localhost:2000/users', person);
         return response;
      } 
      catch(error) {
         console.log(error);
         return false;
      }
   }

   async function makeDeleteCall(id){
      try{
         const response = await axios.delete(`http://localhost:2000/users/${id}`);
         console.log(`http://localhost:2000/users/${id}`);
         return response;
      }
      catch(error) {
         console.log(error);
         return false
      }
   }

   useEffect(() => {
      fetchAll().then( result => {
         if (result)
            setCharacters(result);
       });
   }, [] );

   return (
     <div className="container">
       <Table characterData={characters} removeCharacter={removeOneCharacter} />
       <Form handleSubmit={updateList} />
     </div>
   );
}

export default MyApp;
