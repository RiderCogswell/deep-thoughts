import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_THOUGHT } from "../../utils/mutations";
import { QUERY_THOUGHTS, QUERY_ME } from "../../utils/queries";

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0)

  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      // could potentially not exist yet, so wrap i ntry,... catch
      try {
        // update me arrays cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME, 
          // sets thoughts to add new thought to end of array

          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
        });
      } catch (err) {
        console.warn('First thought insertion by user!')
      }
      
      // update thoughts array cache
      // read whats currently in the cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

      // prepend the newest thought to the front of the array
      cache.writeQuery({
        // read tje
        query: QUERY_THOUGHTS,
        // addThought representing the new thought created
        data: { thoughts: [addThought, ...thoughts] }
      });
    }
  });

  // handle change to text
  const handleChange = event => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length)
    }
  }

  // return the form to empty and, add thought to db
  const handleFormSubmit = async event => {
    event.preventDefault();

    try {
      // add thought to database
      await addThought({
        variables: { thoughtText }
      });
      
      // clear form value
      setText('');
      setCharacterCount(0)
    } catch (err) {
      console.error(err);
    }
    
  }

  return (
    <div>
      {/* keep track of chars and put an error class if chars = 280 */}
      <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;