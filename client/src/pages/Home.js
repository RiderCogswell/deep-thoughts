import React from 'react'; 
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  // use useQuery hook to make a query request
  // loading literally is returned to indicate the requests not done yet
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  // called 'OPTIONAL CHAINING', currently only supported in the browser
  // negates the need to check if an object exists before accessing its properties
  // literally reads = if data exists, store it in the thoughts constant, if not, store an empty array
  const thoughts = data?.thoughts || [];

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Food for Thought(s)..." />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
